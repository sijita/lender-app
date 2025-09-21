import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function Skeleton({ width = 'w-20' }: { width?: string }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, [opacity]);

  return (
    <Animated.View
      className={`h-6 bg-gray-200 rounded ${width}`}
      style={{
        backgroundColor: '#e5e7eb',
        opacity: opacity,
      }}
    />
  );
}
