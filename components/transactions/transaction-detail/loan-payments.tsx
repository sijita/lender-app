import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { formatCurrency } from '@/utils';

interface LoanPaymentsProps {
  loanId: number;
}

export default function LoanPayments({ loanId }: LoanPaymentsProps) {
  const [showPayments, setShowPayments] = useState(false);
  const [loanPayments, setLoanPayments] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  const fetchLoanPayments = async () => {
    if (!loanId) return;

    try {
      setLoadingPayments(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('loan_id', loanId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLoanPayments(data || []);
    } catch (err) {
      console.error('Error fetching loan payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const togglePaymentsView = async () => {
    if (!showPayments && loanPayments.length === 0) {
      await fetchLoanPayments();
    }
    setShowPayments(!showPayments);
  };

  return (
    <View>
      <TouchableOpacity
        onPress={togglePaymentsView}
        className="mt-4 p-4 border border-gray-200 rounded-lg flex-row items-center justify-center gap-2"
      >
        <Ionicons
          name={showPayments ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#6B7280"
        />
        <Text className="font-geist-medium text-center">
          {showPayments ? 'Ocultar pagos' : 'Ver todos los pagos'}
        </Text>
      </TouchableOpacity>

      {showPayments && (
        <View className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          <View className="flex-row bg-gray-100 px-4 py-3">
            <Text className="flex-1 font-geist-medium">Fecha</Text>
            <Text className="flex-1 font-geist-medium text-right">Monto</Text>
          </View>

          {loadingPayments ? (
            <View className="py-6 items-center">
              <ActivityIndicator size="small" color="#000" />
              <Text className="mt-2 text-gray-500">Cargando pagos...</Text>
            </View>
          ) : loanPayments.length === 0 ? (
            <View className="py-6 items-center">
              <Text className="text-gray-500">No hay pagos registrados</Text>
            </View>
          ) : (
            loanPayments.map((payment) => (
              <View
                key={payment.id}
                className="flex-row px-4 py-3 border-t border-gray-100"
              >
                <Text className="flex-1 font-geist-regular">
                  {format(new Date(payment.created_at), "dd 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </Text>
                <Text className="flex-1 font-geist-medium text-right">
                  {formatCurrency(payment.amount)}
                </Text>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}
