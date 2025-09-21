import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SquarePen, Receipt } from 'lucide-react-native';
import NewLoanButton from '@/components/ui/new-loan-button';
import NewPaymentButton from '@/components/ui/new-payment-button';
import usePaymentReceipt from '@/hooks/use-payment-receipt';
import PaymentReceipt from '@/components/transactions/payment-receipt';

export default function QuickActions({
  loanId,
  clientId,
  transactionId,
  paymentId,
}: {
  loanId: number;
  clientId?: string;
  transactionId?: number;
  paymentId?: number;
}) {
  const {
    showReceipt,
    receiptData,
    generateReceiptFromPaymentId,
    closeReceipt,
  } = usePaymentReceipt();

  return (
    <>
      <View className="flex-col gap-6 p-5 bg-white rounded-xl border border-gray-100">
        <Text className="text-xl font-geist-bold">Acciones rápidas</Text>
        <Link
          href={`/edit-loan/${loanId}`}
          className="py-4 bg-amber-500 rounded-xl"
          asChild
        >
          <TouchableOpacity className="flex-row gap-2 justify-center items-center">
            <Text className="text-center text-white font-geist-medium">
              Editar préstamo
            </Text>
            <SquarePen size={16} color="#fff" />
          </TouchableOpacity>
        </Link>
        {transactionId && paymentId && (
          <TouchableOpacity
            className="flex-row gap-2 justify-center items-center py-4 bg-blue-500 rounded-xl"
            onPress={() => generateReceiptFromPaymentId(paymentId)}
          >
            <Text className="text-center text-white font-geist-medium">
              Ver recibo
            </Text>
            <Receipt size={16} color="#fff" />
          </TouchableOpacity>
        )}
        <View className="flex-row gap-3">
          <NewLoanButton clientId={clientId} />
          <NewPaymentButton clientId={clientId} />
        </View>
      </View>
      {showReceipt && receiptData && (
        <PaymentReceipt receiptData={receiptData} onClose={closeReceipt} />
      )}
    </>
  );
}
