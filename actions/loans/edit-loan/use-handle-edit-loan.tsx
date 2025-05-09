import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast-context';
import { router } from 'expo-router';
import useCalculateDueDate from '@/hooks/use-calculate-due-date';
import { Loan, loanSchema } from '@/schemas/loans/loan-schema';
import { ZodError } from 'zod';
import { parse } from '@formkit/tempo';

export default function useHandleEditLoan(loanId: number) {
  const { showToast } = useToast();
  const { dueDate } = useCalculateDueDate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loan, setLoan] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<Loan>>({
    paymentFrequency: 'weekly',
  });
  const [showDatePicker, setShowDatePicker] = useState<
    'start' | 'payment' | null
  >(null);
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

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('loans')
          .select('*, clients(id, name, last_name)')
          .eq('id', loanId)
          .single();

        if (error) throw error;

        if (data) {
          setLoan(data);
          setFormData({
            status: data.status,
            interestRate: data.interest_rate.toString(),
            notes: data.notes || '',
            amount: data.amount.toString(),
            term: data.term.toString(),
            paymentFrequency: data.payment_frequency,
            paymentDate: data.payment_date,
            startDate: data.created_at,
          });
          setFormattedAmount(
            new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(
              Number(data.amount)
            )
          );
        }
      } catch (error: any) {
        console.error('Error fetching loan data:', error);
        showToast({
          message: 'Error al cargar los datos del préstamo',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (loanId) {
      fetchLoanData();
    }
  }, [loanId]);

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

  const handleChange = (field: string, value: any) => {
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
        clientId: loan.client_id,
        startDate: new Date(formData.startDate ?? ''),
        paymentDate: new Date(formData.paymentDate ?? ''),
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

  const updateLoan = async () => {
    if (!validateForm()) {
      showToast({
        message: 'Por favor, complete todos los campos correctamente.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const amount = Number(formData.amount);
      const interestRate = Number(formData.interestRate);
      const term = Number(formData.term);

      const startDateObj =
        typeof formData.startDate === 'string'
          ? new Date(formData.startDate)
          : formData.startDate;

      const dueDateResult = dueDate({
        startDate: startDateObj?.toISOString() ?? '',
        term: term,
        paymentFrequency: formData.paymentFrequency ?? '',
      });

      const { totalInterest, totalPayment, monthlyPayment } = calculatedValues;

      let loanData: {
        status?: string;
        interest?: number;
        interest_rate?: number;
        notes?: string;
        amount?: number;
        term?: number;
        payment_frequency?: string;
        quota?: number;
        total_amount?: number;
        created_at?: Date;
        payment_date?: Date;
        due_date?: Date;
      } = {
        status: formData.status,
        interest: totalInterest,
        interest_rate: interestRate,
        notes: formData.notes,
        amount: amount,
        term: term,
        payment_frequency: formData.paymentFrequency,
        quota: monthlyPayment,
        total_amount: totalPayment,
      };

      if (formData.startDate) {
        loanData.created_at = formData.startDate;
      }

      if (formData.paymentDate) {
        loanData.payment_date = formData.paymentDate;
      }

      if (dueDateResult) {
        loanData.due_date = dueDateResult.dateObject;
      }

      const { error } = await supabase
        .from('loans')
        .update(loanData)
        .eq('id', loanId);
      await supabase
        .from('transactions')
        .update({
          amount,
          created_at: parse({
            date: new Date().toLocaleDateString(),
            format: 'DD/m/YYYY',
            locale: 'es-CO',
          }),
        })
        .eq('loan_id', loanId);

      if (error) {
        throw error;
      }

      setFormData({
        clientId: undefined,
        status: undefined,
        interestRate: '',
        notes: '',
        amount: '',
        term: '',
        paymentFrequency: undefined,
        startDate: undefined,
      });
      setCalculatedValues({
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
      });

      showToast({
        message: 'Préstamo actualizado correctamente',
        type: 'success',
      });

      router.back();
    } catch (error: any) {
      console.error('Error updating loan:', error);
      showToast({
        message:
          error.message ??
          'Error al actualizar el préstamo, inténtalo de nuevo.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showDatePicker,
    isLoading,
    isSubmitting,
    loan,
    errors,
    formData,
    calculatedValues,
    formattedAmount,
    handleAmountChange,
    handleDateSelect,
    handleChange,
    updateLoan,
    setShowDatePicker,
  };
}
