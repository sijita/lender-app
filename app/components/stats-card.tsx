import { Text, View } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';

type StatsCardProps = {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  subtitle?: string;
  icon?: ReactNode;
};

export default function StatsCard({
  title,
  value,
  change,
  subtitle,
  icon,
}: StatsCardProps) {
  const isPositiveChange = change && change.value > 0;

  return (
    <View className="h-[120px] flex-col justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <View className="flex-row justify-between items-start gap-2">
        <Text className="text-gray-800 font-geist-semibold truncate flex-1">
          {title}
        </Text>
        {icon && (
          <Ionicons
            className="text-muted-foreground shrink-0"
            name={icon as keyof typeof Ionicons.glyphMap}
            size={20}
          />
        )}
      </View>
      <View className="flex-col justify-end gap-[2px]">
        <Text className="text-2xl font-geist-black">{value}</Text>
        {change && (
          <View className="flex-row items-center">
            <Text
              className={`font-geist-medium ${
                isPositiveChange ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositiveChange ? '+' : ''}
              {change.value}%
            </Text>
            <Text className="text-gray-500 ml-1 font-geist-regular">
              {change.period}
            </Text>
          </View>
        )}
        {subtitle && (
          <Text className="text-gray-500 font-geist-regular">{subtitle}</Text>
        )}
      </View>
    </View>
  );
}
