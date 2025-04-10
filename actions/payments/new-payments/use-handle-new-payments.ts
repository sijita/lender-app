import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Payment, paymentSchema } from '@/schemas/payments/payment-schema';
import { ZodError } from 'zod';
import { useToast } from '@/components/ui/toast-context';

export default function useHandleNewPayments() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<
    Partial<Payment> & {
      name: string;
      lastName: string;
      documentNumber: string;
      outstanding: number;
      pending_quotas: number;
    }
  >({
    clientId: undefined,
    name: '',
    lastName: '',
    documentNumber: '',
    loanId: undefined,
    amount: '',
    date: new Date(),
    method: 'cash',
    quotas: 1,
    notes: '',
    outstanding: 0,
    pending_quotas: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Payment, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
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

  const handleChange = (field: keyof Payment, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDateSelect = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('date', selectedDate);
    }
  };

  const handleClientSelect = (value: string) => {
    const selectedItem = searchResults.find(
      (item) => item.id.toString() === value
    );
    if (selectedItem) {
      selectClient(selectedItem.client, selectedItem);
    }
  };

  const selectClient = (client: any, loan: any) => {
    setFormData((prev) => ({
      ...prev,
      clientId: client.id,
      name: client.name,
      lastName: client.last_name,
      documentNumber: client.document_number,
      outstanding: loan.outstanding,
      loanId: loan.id,
      pending_quotas: loan.pending_quotas,
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  const searchClients = async (query: string) => {
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
        .from('loans')
        .select(
          `
          id,
          amount,
          outstanding,
          pending_quotas,
          client:client_id (
            id,
            name,
            last_name,
            document_number
          )
        `
        )
        .eq('status', 'active')
        .or(queryFilter, {
          referencedTable: 'client',
        })
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching clients:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const formattedSearchResults = searchResults.map((item) => ({
    id: item?.id?.toString(),
    label: `${item?.client?.name} ${item?.client?.last_name || ''}`,
    metadata: {
      client: item?.client,
      outstanding: item?.outstanding,
    },
  }));

  const validateForm = (): boolean => {
    try {
      paymentSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof Payment, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof Payment;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const savePayment = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const paymentData = {
        loan_id: formData.loanId,
        amount: Number(formData.amount),
        method: formData.method,
        notes: formData.notes,
        quotas: formData.quotas,
        status: 'completed',
      };

      const { error: paymentError } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (paymentError) throw paymentError;

      setFormData({
        clientId: undefined,
        name: '',
        lastName: '',
        documentNumber: '',
        loanId: undefined,
        amount: '',
        date: new Date(),
        method: 'cash',
        notes: '',
        outstanding: 0,
        pending_quotas: 0,
      });

      showToast({
        type: 'success',
        message: 'Pago registrado correctamente',
      });

      router.push('/(tabs)/transactions');
    } catch (error: any) {
      console.error('Error saving payment:', error);
      showToast({
        type: 'error',
        message: error.message ?? 'Error al registrar el pago',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    showDatePicker,
    searchQuery,
    searchResults,
    isSearching,
    formattedAmount,
    formattedSearchResults,
    handleChange,
    handleDateSelect,
    setShowDatePicker,
    searchClients,
    selectClient,
    savePayment,
    handleClientSelect,
    handleAmountChange,
  };
}
