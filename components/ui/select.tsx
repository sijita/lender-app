import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import DynamicIcon from './dynamic-icon';
import { Check } from 'lucide-react-native';

type Option = {
  id: string;
  label: string;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string | null;
  onChange: (value: string, label: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  testID?: string;
};

const Select = ({
  label,
  placeholder = 'Seleccionar',
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  testID,
}: SelectProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const selectedOption = options.find((option) => option.id === value);

  const toggleOptions = () => {
    if (!disabled) {
      setShowOptions(!showOptions);
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option.id, option.label);
    setShowOptions(false);
  };

  return (
    <View className="flex-col gap-2" testID={testID}>
      {label && (
        <Text className="font-geist-medium">
          {label}
          {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}
      <TouchableOpacity
        className={`border ${
          error ? 'border-red-500' : 'border-gray-200'
        } rounded-lg p-3 flex-row justify-between items-center ${
          disabled ? 'opacity-50' : ''
        }`}
        onPress={toggleOptions}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text className={`${selectedOption ? 'text-black' : 'text-gray-500'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <DynamicIcon
          name={showOptions ? 'ChevronUp' : 'ChevronDown'}
          size={20}
          color="#6B7280"
        />
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptions(false)}
        >
          <View className="bg-white rounded-lg mx-4 shadow-lg overflow-hidden">
            <View className="border-b border-gray-100 py-3 px-4">
              <Text className="font-geist-medium text-lg">
                {label || 'Seleccionar opción'}
              </Text>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 300, minWidth: '80%' }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-3 px-4 border-b border-gray-100 flex-row justify-between items-center ${
                    item.id === value ? 'bg-gray-50' : ''
                  }`}
                  onPress={() => handleSelect(item)}
                >
                  <Text className="font-geist-regular text-base">
                    {item.label}
                  </Text>
                  {item.id === value && <Check size={20} color="#000" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Select;
