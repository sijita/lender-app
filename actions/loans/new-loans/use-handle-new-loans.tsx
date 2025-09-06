import { useMemo, useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { ZodError } from 'zod';
import { loanSchema, Loan } from '@/schemas/loans/loan-schema';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast-context';
import { useDebouncedCallback } from 'use-debounce';
import useCalculateDueDate from '@/hooks/use-calculate-due-date';
import { format } from '@formkit/tempo';

export function useHandleNewLoans() {
  const { showToast } = useToast();
  const { dueDate } = useCalculateDueDate();
  const { clientId } = useLocalSearchParams<{ clientId?: string }>();
  const [formData, setFormData] = useState<
    Partial<Loan> & {
      name?: string;
      lastName?: string;
      documentNumber?: string;
    }
  >({
    name: '',
    lastName: '',
    documentNumber: '',
    amount: '',
    interestRate: '',
    term: '',
    notes: '',
    paymentFrequency: 'weekly', // Default to weekly
  });
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
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Preselect client if clientId is provided in query params
  useEffect(() => {
    if (clientId) {
      const fetchClient = async () => {
        try {
          const { data, error } = await supabase
            .from('clients')
            .select('id, name, last_name, document_number')
            .eq('id', clientId)
            .single();

          if (error) throw error;

          if (data) {
            selectClient(data);
          }
        } catch (error) {
          console.error('Error fetching client:', error);
        }
      };

      fetchClient();
    }
  }, [clientId]);

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
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => {
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
      };

      loanSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof Loan, string>> = {};
        error.errors.forEach(err => {
          const path = err.path[0] as keyof Loan;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleClientSelect = (value: string) => {
    const selectedItem = searchResults.find(
      item => item.id.toString() === value
    );
    if (selectedItem) {
      selectClient(selectedItem);
    }
  };

  const selectClient = (client: any) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      name: client.name,
      lastName: client.last_name || '',
      documentNumber: client.document_number,
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  const searchClients = useDebouncedCallback(async (query: string) => {
    setSearchQuery(query);

    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);

      const isNumeric = /^\d+$/.test(query);

      let queryFilter;
      if (isNumeric) {
        queryFilter = `document_number.eq.${query}`;
      } else {
        queryFilter = `name.ilike.%${query}%,last_name.ilike.%${query}%`;
      }

      const { data, error } = await supabase
        .from('clients')
        .select(
          `
            id,
            name,
            last_name,
            document_number
          `
        )
        .or(queryFilter)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching clients:', error);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  const formattedSearchResults = searchResults.map(item => ({
    id: item?.id?.toString(),
    label: `${item?.name} ${item?.last_name || ''}`,
    documentNumber: item?.document_number,
  }));

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
      const dueDateResult = dueDate({
        startDate: formData.startDate?.toISOString() ?? '',
        term: term,
        paymentFrequency: formData.paymentFrequency ?? '',
      });

      const { totalInterest, totalPayment, monthlyPayment } = calculatedValues;

      // Formatear fechas en timezone America/Bogota
      const paymentDateFormatted = formData.paymentDate
        ? format({
            date: formData.paymentDate,
            tz: 'America/Bogota',
            format: 'YYYY-MM-DD',
          })
        : undefined;
      const startDateFormatted = formData.startDate
        ? format({
            date: formData.startDate,
            tz: 'America/Bogota',
            format: 'YYYY-MM-DD',
          })
        : undefined;

      const loanData = {
        amount,
        interest: totalInterest,
        interest_rate: interestRate,
        quota: monthlyPayment,
        term: term,
        pending_quotas: formData.term,
        payment_date: paymentDateFormatted,
        due_date: dueDateResult?.dateObject,
        status: 'active',
        client_id: formData.clientId,
        total_amount: totalPayment,
        outstanding: totalPayment,
        payment_frequency: formData.paymentFrequency || 'weekly',
        paid_amount: 0,
        notes: formData.notes || null,
        created_at: startDateFormatted,
      };

      const { error } = await supabase.from('loans').insert(loanData).select();

      if (error) {
        throw error;
      }

      setFormData({
        name: '',
        lastName: '',
        documentNumber: '',
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
    showDatePicker,
    errors,
    isSubmitting,
    calculatedValues,
    formattedAmount,
    isSearching,
    searchQuery,
    searchResults,
    formattedSearchResults,
    handleAmountChange,
    handleChange,
    selectClient,
    handleDateSelect,
    setShowDatePicker,
    saveLoan,
    handleClientSelect,
    searchClients,
  };
}
