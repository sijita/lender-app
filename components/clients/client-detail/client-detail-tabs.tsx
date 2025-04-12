import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import ClientFinancialSummary from './client-financial-summary';
import { ClientDetail } from '@/actions/clients/use-fetch-client-detail';
import ClientPaymentHistory from './client-payment-history';
import ClientLoansHistory from './client-loans-history';

export default function ClientDetailTabs({ client }: { client: ClientDetail }) {
  const [activeTab, setActiveTab] = useState('resumen');

  const tabs = [
    { id: 'resumen', label: 'Resumen' },
    { id: 'prestamos', label: 'Préstamos' },
    { id: 'pagos', label: 'Pagos' },
    { id: 'notas', label: 'Notas' },
  ];

  return (
    <View className="bg-white rounded-xl border border-gray-100">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200"
      >
        <View className="flex-row">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`px-5 py-4 ${
                activeTab === tab.id ? 'border-b-2 border-black' : ''
              }`}
            >
              <Text
                className={`font-geist-semibold ${
                  activeTab === tab.id ? 'text-black' : 'text-gray-500'
                }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View className="p-5">
        {activeTab === 'resumen' && <ClientFinancialSummary client={client} />}
        {activeTab === 'prestamos' && (
          <ClientLoansHistory loans={client.loans_history} />
        )}
        {activeTab === 'pagos' && (
          <ClientPaymentHistory payments={client.payment_history} />
        )}
        {activeTab === 'notas' && (
          <Text className="text-gray-500">Notas sobre el cliente</Text>
        )}
      </View>
    </View>
  );
}
