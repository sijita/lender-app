import { Text, View } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function StatsCard({
  title,
  value,
  change,
  subtitle,
  icon,
}: {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  subtitle?: string;
  icon?: ReactNode;
}) {
  const isPositiveChange = change && change.value > 0;

  return (
    <View className="h-[120px] flex-col justify-between bg-white rounded-xl p-4 border border-gray-100">
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
        <Text
          className={`${
            value.toString().length > 5 ? 'text-xl' : 'text-2xl'
          } font-geist-extrabold`}
        >
          {value}
        </Text>
        {change && (
          <View className="flex-row items-center">
            <Text
              className={`text-sm font-geist-medium ${
                isPositiveChange ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {isPositiveChange ? '+' : ''}
              {change.value}%
            </Text>
            <Text className="text-sm text-gray-500 ml-1 font-geist-regular">
              {change.period}
            </Text>
          </View>
        )}
        {subtitle && (
          <Text className="text-gray-500 font-geist-regular text-sm">
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
}
