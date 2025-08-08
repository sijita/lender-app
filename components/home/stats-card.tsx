import { Text, View } from 'react-native';
import { ReactNode } from 'react';

export default function StatsCard({
  title,
  value,
  change,
  subtitle,
  icon,
  isLoading,
}: {
  title: string;
  value: string | number | Element;
  change?: {
    value: number;
    period: string;
  };
  subtitle?: string;
  icon?: ReactNode;
  isLoading: Boolean;
}) {
  const isPositiveChange = change && change.value > 0;

  return (
    <View className="h-[120px] flex-col justify-between bg-white rounded-xl p-4 border border-gray-100">
      <View className="flex-row gap-2 justify-between items-start">
        <Text className="flex-1 text-gray-800 truncate font-geist-semibold">
          {title}
        </Text>
        {icon}
      </View>
      <View className="flex-col justify-end gap-[2px]">
        {isLoading ? (
          <>{value}</>
        ) : (
          <Text
            className={`${
              value.toString().length > 5 && title !== 'Desembolsado en el mes'
                ? 'text-xl'
                : 'text-2xl'
            } font-geist-extrabold`}
          >
            {value as string}
          </Text>
        )}
        {change && (
          <View className="flex-row items-center">
            <Text
              className={`text-sm font-geist-medium ${
                isPositiveChange ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositiveChange ? '+' : ''}
              {change.value.toFixed(1)}%
            </Text>
            <Text className="ml-1 text-sm text-gray-500 font-geist-regular">
              {change.period}
            </Text>
          </View>
        )}
        {subtitle && (
          <Text className="text-sm text-gray-500 font-geist-regular">
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}
