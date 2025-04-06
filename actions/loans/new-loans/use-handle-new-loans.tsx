import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import { ZodError } from 'zod';
import { loanSchema, Loan } from '@/schemas/loans/loan-schema';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast-context';

export function useHandleNewLoans() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<Partial<Loan>>({
    amount: '',
    interestRate: '',
    term: '',
    notes: '',
    paymentFrequency: 'weekly', // Default to weekly
  });
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<
    'start' | 'payment' | null
  >(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Loan, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedValues, setCalculatedValues] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
  });
  const [formattedAmount, setFormattedAmount] = useState(
    formData.amount
      ? new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(
          Number(formData.amount)
        )
      : ''
  );

  const handleAmountChange = (text: string) => {
    const numericValue = text.replace(/\D/g, '');

    handleChange('amount', numericValue);

    const formatted = numericValue
      ? new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(
          Number(numericValue)
        )
      : '';
    setFormattedAmount(formatted);
  };

  const handleChange = (field: keyof Loan, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const selectClient = (clientId: number) => {
    setSelectedClient(clientId);
    setFormData((prev) => ({
      ...prev,
      clientId: Number(clientId),
    }));
  };

  const handleDateSelect = (date: Date, type: 'start' | 'payment') => {
    handleChange(type === 'start' ? 'startDate' : 'paymentDate', date);
    setShowDatePicker(null);
  };

  useMemo(() => {
    const amount = Number(formData.amount) || 0;
    const interestRate = Number(formData.interestRate) || 0;
    const term = Number(formData.term) || 1;
    const frequency = formData.paymentFrequency || 'weekly';

    if (amount > 0 && term > 0) {
      // Adjust calculation based on payment frequency
      let periodFactor = 1;
      switch (frequency) {
        case 'daily':
          periodFactor = 1 / 30; // Approximate for daily
          break;
        case 'weekly':
          periodFactor = 1 / 4; // 1/4 of a month
          break;
        case 'biweekly':
          periodFactor = 1 / 2; // 1/2 of a month
          break;
        case 'monthly':
          periodFactor = 1; // Full month
          break;
        default:
          periodFactor = 1 / 4; // Default to weekly
      }

      const totalInterest =
        amount * (interestRate / 100) * (term * periodFactor);
      const totalPayment = amount + totalInterest;
      const paymentAmount = totalPayment / term;

      const roundToThousand = (num: number) => Math.ceil(num / 1000) * 1000;

      setCalculatedValues({
        monthlyPayment: roundToThousand(paymentAmount),
        totalPayment: roundToThousand(totalPayment),
        totalInterest: roundToThousand(totalInterest),
      });
    }
  }, [
    formData.amount,
    formData.interestRate,
    formData.term,
    formData.paymentFrequency,
  ]);

  const validateForm = () => {
    try {
      const dataToValidate = {
        ...formData,
        clientId: selectedClient,
      };

      loanSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof Loan, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof Loan;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const saveLoan = async () => {
    if (!validateForm()) {
      showToast({
        message: 'Por favor, corrija los errores en el formulario',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = Number(formData.amount);
      const interestRate = Number(formData.interestRate);
      const term = Number(formData.term);

      const { totalInterest, totalPayment, monthlyPayment } = calculatedValues;

      const loanData = {
        amount,
        interest: totalInterest,
        interest_rate: interestRate,
        quota: monthlyPayment,
        pending_quotas: term,
        payment_date: formData.paymentDate?.toISOString().split('T')[0],
        due_date: formData.startDate?.toISOString(),
        status: 'active',
        client_id: selectedClient,
        total_amount: totalPayment,
        outstanding: totalPayment,
        payment_frequency: formData.paymentFrequency || 'weekly',
        paid_amount: 0,
        notes: formData.notes || null,
      };

      const { error } = await supabase.from('loans').insert(loanData).select();

      if (error) {
        throw error;
      }

      setFormData({
        amount: '',
        interestRate: '',
        term: '',
        notes: '',
      });
      setCalculatedValues({
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
      });

      showToast({
        message: 'Préstamo registrado con éxito',
        type: 'success',
      });

      router.push('/(tabs)/transactions');
    } catch (error: any) {
      console.error('Error saving loan:', error);
      showToast({
        message:
          error.message ?? 'Error al guardar el préstamo, inténtalo de nuevo.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    selectedClient,
    showDatePicker,
    errors,
    isSubmitting,
    calculatedValues,
    formattedAmount,
    handleAmountChange,
    handleChange,
    selectClient,
    handleDateSelect,
    setShowDatePicker,
    saveLoan,
  };
}
