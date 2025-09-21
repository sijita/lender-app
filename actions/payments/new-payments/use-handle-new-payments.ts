import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { router, useLocalSearchParams } from 'expo-router';
import { Payment, paymentSchema } from '@/schemas/payments/payment-schema';
import { ZodError } from 'zod';
import { useToast } from '@/components/ui/toast-context';
import { useDebouncedCallback } from 'use-debounce';
import { formatCurrency } from '@/utils';

export default function useHandleNewPayments() {
  const { showToast } = useToast();
  const { clientId } = useLocalSearchParams<{ clientId?: string }>();
  const [formData, setFormData] = useState<
    Partial<Payment> & {
      name: string;
      lastName: string;
      documentNumber: string;
      outstanding: number;
      pending_quotas: number;
      quota: number;
      partialQuota: number;
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
    notes: '',
    outstanding: 0,
    pending_quotas: 0,
    quota: 1,
    partialQuota: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Payment, string>>>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [formattedAmount, setFormattedAmount] = useState(
    formData.amount
      ? new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(
          Number(formData.amount)
        )
      : ''
  );

  // Estados para el recibo
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

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
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => {
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

  // Preselect client if clientId is provided in query params
  useEffect(() => {
    if (clientId) {
      const fetchClientAndLoan = async () => {
        try {
          // First get the client data
          const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('id, name, last_name, document_number')
            .eq('id', clientId)
            .single();

          if (clientError) throw clientError;

          // Then get the active loan for this client
          const { data: loan, error: loanError } = await supabase
            .from('loans')
            .select(
              'id, amount, outstanding, pending_quotas, quota, partial_quota, status'
            )
            .eq('client_id', clientId)
            .in('status', ['active', 'defaulted'])
            .not('outstanding', 'eq', 0)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (loanError) {
            console.error('No active loan found for client:', loanError);
            return;
          }

          if (client && loan) {
            selectClient(client, loan);
          }
        } catch (error) {
          console.error('Error fetching client and loan:', error);
        }
      };

      fetchClientAndLoan();
    }
  }, [clientId]);

  const handleClientSelect = (value: string) => {
    const selectedItem = searchResults.find(
      item => item.id.toString() === value
    );
    if (selectedItem) {
      selectClient(selectedItem.client, selectedItem);
    }
  };

  const selectClient = (client: any, loan: any) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      name: client.name,
      lastName: client.last_name,
      documentNumber: client.document_number,
      outstanding: loan.outstanding,
      loanId: loan.id,
      pending_quotas: loan.pending_quotas,
      quota: loan.quota,
      partialQuota: loan.partial_quota,
    }));
    setSearchResults([]);
  };

  const searchClients = useDebouncedCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);

      const isNumeric = /^\d+$/.test(query);

      let queryFilter = '';
      if (isNumeric) {
        queryFilter = `document_number.eq.${query}`;
      } else {
        const terms = query
          .trim()
          .split(' ')
          .filter(term => term.length > 0);

        if (terms.length === 1) {
          // Single term: search in both name and last_name
          queryFilter = `name.ilike.%${terms[0]}%,last_name.ilike.%${terms[0]}%`;
        } else if (terms.length === 2) {
          // Two terms: exact match - first term in name AND second term in last_name
          queryFilter = `and(name.ilike.%${terms[0]}%,last_name.ilike.%${terms[1]}%)`;
        } else if (terms.length > 2) {
          // More than two terms: treat as full name search
          const firstName = terms[0];
          const lastName = terms.slice(1).join(' ');
          queryFilter = `and(name.ilike.%${firstName}%,last_name.ilike.%${lastName}%)`;
        }
      }

      // First get loans with active or defaulted status
      const { data: loans, error: loansError } = await supabase
        .from('loans')
        .select(
          `
          id,
          amount,
          outstanding,
          pending_quotas,
          quota,
          partial_quota,
          status,
          client_id
        `
        )
        .in('status', ['active', 'defaulted'])
        .not('client_id', 'is', null)
        .not('outstanding', 'eq', 0)
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      if (!loans || loans.length === 0) {
        setSearchResults([]);
        return;
      }

      // Get unique client IDs from loans
      const clientIds = [...new Set(loans.map(loan => loan.client_id))];

      // Search clients that match the query and are in the clientIds
      const { data: clients, error: clientError } = await supabase
        .from('clients')
        .select('id, name, last_name, document_number')
        .in('id', clientIds)
        .or(queryFilter);

      if (clientError) throw clientError;

      // Combine loans with their corresponding clients
      const loansWithClients = loans
        .map(loan => {
          const client = clients?.find(c => c.id === loan.client_id);
          return client
            ? {
                ...loan,
                client: {
                  id: client.id,
                  name: client.name,
                  last_name: client.last_name,
                  document_number: client.document_number,
                },
              }
            : null;
        })
        .filter(Boolean);

      console.log('loansWithClients:', loansWithClients);

      setSearchResults(loansWithClients || []);
    } catch (error) {
      console.error('Error searching clients:', error);
    } finally {
      setIsSearching(false);
    }
  }, 500);

  const formattedSearchResults = searchResults.map(item => ({
    id: item?.id?.toString(),
    label: `${item?.client?.name} ${item?.client?.last_name || ''}`,
    metadata: {
      client: item?.client,
      outstanding: item?.outstanding,
    },
  }));

  const getPaymentStatus = useCallback(() => {
    if (
      !formData.amount ||
      !formData.quota ||
      formData.partialQuota === undefined
    ) {
      return 'partial';
    }
    const totalPayment = Number(formData.amount) + formData.partialQuota;
    return totalPayment >= formData.quota ? 'completed' : 'partial';
  }, [formData.amount, formData.quota, formData.partialQuota]);

  const getQuotasCovered = useCallback(() => {
    if (
      !formData.amount ||
      !formData.quota ||
      formData.partialQuota === undefined
    ) {
      return 0;
    }
    const totalPayment = Number(formData.amount) + formData.partialQuota;
    return Math.floor(totalPayment / formData.quota);
  }, [formData.amount, formData.quota, formData.partialQuota]);

  const validateForm = (): boolean => {
    try {
      paymentSchema.parse({
        ...formData,
        amount: formData.amount,
        status: getPaymentStatus(),
        quotas: getQuotasCovered(),
      });

      if (Number(formData.amount) > formData.outstanding) {
        showToast({
          type: 'error',
          message: 'El monto no puede ser mayor al saldo pendiente',
        });
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      console.log('error:', error);
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof Payment, string>> = {};
        error.errors.forEach(err => {
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
      return { success: false };
    }

    try {
      setIsSubmitting(true);

      const paymentStatus = getPaymentStatus();
      const quotasCovered = getQuotasCovered();
      const paymentData = {
        loan_id: formData.loanId,
        amount: Number(formData.amount),
        method: formData.method,
        notes:
          formData.notes ||
          `Pago de ${formatCurrency(
            Number(formData.amount)
          )} (${paymentStatus})`,
        status: paymentStatus,
        quotas: quotasCovered, // Added to avoid null
      };

      console.log('paymentData:', paymentData);

      const { data: paymentResult, error: paymentError } = await supabase
        .from('payments')
        .insert(paymentData)
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Obtener datos del cliente para el recibo
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('email, phone')
        .eq('id', formData.clientId)
        .single();

      if (clientError) {
        console.warn('Error fetching client contact data:', clientError);
      }

      // Generar datos del recibo
      const paymentReceiptData = {
        transactionId: paymentResult?.id || `PAY-${Date.now()}`,
        amount: Number(formData.amount),
        date: formData.date || new Date(),
        method: formData.method,
        notes: formData.notes,
        status: paymentStatus,
        quotasCovered: quotasCovered,
        client: {
          name: formData.name,
          lastName: formData.lastName,
          documentNumber: formData.documentNumber,
          email: clientData?.email || '',
          phone: clientData?.phone || '',
        },
        loan: {
          id: formData.loanId,
          previousBalance: formData.outstanding + Number(formData.amount),
          currentBalance: formData.outstanding,
          quota: formData.quota,
          partialQuota: formData.partialQuota,
        },
      };

      // Configurar el recibo para mostrar
      setReceiptData(paymentReceiptData);
      setShowReceipt(true);

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
        quota: 1,
        partialQuota: 0,
      });
      setFormattedAmount('');

      showToast({
        type: 'success',
        message: 'Pago registrado correctamente',
      });

      // Retornar datos para el recibo
      return {
        success: true,
        paymentId: paymentResult?.id,
        clientEmail: clientData?.email || '',
        clientPhone: clientData?.phone || '',
      };
    } catch (error: any) {
      console.error('Error saving payment:', error);
      showToast({
        type: 'error',
        message:
          error.code === '23502'
            ? 'Falta un campo requerido en el pago'
            : (error.message ?? 'Error al registrar el pago'),
      });
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
    router.push('/(tabs)/transactions');
  };

  return {
    formData,
    errors,
    isSubmitting,
    showDatePicker,
    searchResults,
    isSearching,
    formattedAmount,
    formattedSearchResults,
    searchClients,
    handleChange,
    handleDateSelect,
    setShowDatePicker,
    selectClient,
    savePayment,
    handleClientSelect,
    handleAmountChange,
    getPaymentStatus,
    getQuotasCovered,
    // Estados y funciones del recibo
    showReceipt,
    receiptData,
    closeReceipt,
  };
}
