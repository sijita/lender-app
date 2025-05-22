import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitting: boolean;
  processingLabel?: string;
}

const ActionButtons = ({
  onCancel,
  onSubmit,
  submitLabel,
  isSubmitting,
  processingLabel = 'Procesando...',
}: ActionButtonsProps) => {
  return (
    <View className="flex-row justify-between mt-4">
      <TouchableOpacity
        className="bg-white py-3 px-6 border border-gray-200 rounded-lg"
        onPress={onCancel}
        disabled={isSubmitting}
      >
        <Text className="font-geist-medium">Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`py-3 px-6 rounded-lg ${
          isSubmitting ? 'bg-gray-400' : 'bg-black'
        }`}
        onPress={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <View className="flex-row items-center">
            <ActivityIndicator size="small" color="white" />
            <Text className="font-geist-medium text-white ml-2">
              {processingLabel}
            </Text>
          </View>
        ) : (
          <Text className="font-geist-medium text-white">{submitLabel}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;
