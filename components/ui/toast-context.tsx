import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Animated } from 'react-native';
import { Toast, ToastType } from './toast';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (props: ToastProps) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('info');
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showToast = ({
    message,
    type = 'info',
    duration = 3000,
  }: ToastProps) => {
    setMessage(message);
    setToastType(type);
    setVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto hide after duration
    setTimeout(() => {
      hideToast();
    }, duration);
  };

  const hideToast = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={toastType}
        onClose={hideToast}
        fadeAnim={fadeAnim}
      />
    </ToastContext.Provider>
  );
};
