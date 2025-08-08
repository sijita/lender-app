import { View } from 'react-native';

export default function Skeleton({ width = 'w-20' }: { width?: string }) {
  return (
    <View
      className={`h-6 bg-gray-200 rounded animate-pulse ${width}`}
      style={{ backgroundColor: '#e5e7eb' }}
    />
  );
}
