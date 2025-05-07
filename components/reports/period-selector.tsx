import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Select from '@/components/ui/select';
import { Calendar } from 'lucide-react-native';

type PeriodOption = {
  id: string;
  label: string;
};

type DateRange = {
  startDate: Date;
  endDate: Date;
};

interface PeriodSelectorProps {
  onPeriodChange: (range: DateRange) => void;
}

const periodOptions: PeriodOption[] = [
  { id: 'today', label: 'Hoy' },
  { id: 'week', label: 'Esta semana' },
  { id: 'month', label: 'Este mes' },
  { id: 'quarter', label: 'Este trimestre' },
  { id: 'year', label: 'Este año' },
  { id: 'all', label: 'Todo el tiempo' },
];

export default function PeriodSelector({
  onPeriodChange,
}: PeriodSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month');

  const calculateDateRange = (periodId: string): DateRange => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endDate = new Date(now);
    let startDate = new Date(now);

    switch (periodId) {
      case 'today':
        startDate = today;
        break;
      case 'week':
        // Inicio de la semana (domingo)
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay());
        break;
      case 'month':
        // Inicio del mes
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'quarter':
        // Inicio del trimestre
        const quarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case 'year':
        // Inicio del año
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
      case 'all':
        // Fecha muy antigua para incluir todo
        startDate = new Date(2000, 0, 1);
        break;
      default:
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    return { startDate, endDate };
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    const dateRange = calculateDateRange(value);
    onPeriodChange(dateRange);
  };

  return (
    <View className="flex-row justify-between gap-2">
      <View className="flex-row items-center gap-2">
        <Calendar size={18} color="#6B7280" />
        <Text className="font-geist-semibold text-xl">Período de tiempo</Text>
      </View>
      <Select
        options={periodOptions}
        value={selectedPeriod}
        onChange={handlePeriodChange}
        placeholder="Seleccionar período"
      />
    </View>
  );
}
