import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast-context';

export interface PaymentReceiptData {
  transactionId: string;
  amount: number;
  date: Date;
  method: string;
  notes?: string;
  status: string;
  quotasCovered: number;
  client: {
    name: string;
    lastName: string;
    documentNumber: string;
    email?: string;
    phone?: string;
  };
  loan: {
    id: number;
    previousBalance: number;
    currentBalance: number;
    quota: number;
    partialQuota?: number;
  };
}

export default function usePaymentReceipt() {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [receiptData, setReceiptData] = useState<PaymentReceiptData | null>(
    null
  );
  const [showReceipt, setShowReceipt] = useState(false);

  const generateReceiptFromPaymentId = async (paymentId: number) => {
    try {
      setIsLoading(true);

      // Obtener datos del pago
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select(
          `
          id,
          amount,
          method,
          notes,
          status,
          quotas,
          created_at,
          loan_id,
          loans!inner (
            id,
            outstanding,
            amount,
            quota,
            term,
            paid_amount,
            partial_quota,
            client_id,
            clients!inner (
              id,
              name,
              last_name,
              document_number,
              email,
              phone
            )
          )
        `
        )
        .eq('id', paymentId)
        .single();

      if (paymentError) {
        throw new Error('No se pudo encontrar el pago');
      }

      // Calcular el saldo anterior de capital (antes de este pago)
      // Primero calculamos el capital pagado antes de este pago
      const paidAmountBeforeThisPayment =
        (paymentData.loans?.paid_amount || 0) - paymentData.amount;
      const quotasPaidBefore =
        paidAmountBeforeThisPayment / (paymentData.loans?.quota || 1);
      const capitalPerQuotaBefore =
        (paymentData.loans?.amount || 0) / (paymentData.loans?.term || 1);
      const capitalPaidBefore = quotasPaidBefore * capitalPerQuotaBefore;

      const previousBalance =
        (paymentData.loans?.amount || 0) - capitalPaidBefore;

      // Calcular el saldo actual de capital
      // amount = capital total del préstamo
      // paid_amount = total pagado (incluye intereses)
      // amount/term = cuota de capital por período (sin intereses)
      // Para obtener el capital pagado: (paid_amount / quota) * (amount / term)
      const quotasPaid =
        (paymentData.loans?.paid_amount || 0) / (paymentData.loans?.quota || 1);
      const capitalPerQuota =
        (paymentData.loans?.amount || 0) / (paymentData.loans?.term || 1);
      const capitalPaid = quotasPaid * capitalPerQuota;

      const currentBalance = (paymentData.loans?.amount || 0) - capitalPaid;

      // Generar datos del recibo
      const receipt: PaymentReceiptData = {
        transactionId: `PAY-${paymentData.id}`,
        amount: paymentData.amount,
        date: new Date(paymentData.created_at),
        method: paymentData.method,
        notes: paymentData.notes,
        status: paymentData.status,
        quotasCovered: paymentData.quotas || 0,
        client: {
          name: paymentData.loans.clients.name,
          lastName: paymentData.loans.clients.last_name,
          documentNumber: paymentData.loans.clients.document_number,
          email: paymentData.loans.clients.email,
          phone: paymentData.loans.clients.phone,
        },
        loan: {
          id: paymentData.loans.id,
          previousBalance: previousBalance,
          currentBalance: currentBalance,
          quota: paymentData.loans.quota,
          partialQuota: paymentData.loans.partial_quota,
        },
      };

      setReceiptData(receipt);
      setShowReceipt(true);

      return receipt;
    } catch (error: any) {
      console.error('Error generating receipt:', error);
      showToast({
        type: 'error',
        message: error.message || 'Error al generar el recibo',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const generateReceiptFromData = (data: PaymentReceiptData) => {
    setReceiptData(data);
    setShowReceipt(true);
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
  };

  return {
    isLoading,
    receiptData,
    showReceipt,
    generateReceiptFromPaymentId,
    generateReceiptFromData,
    closeReceipt,
  };
}
