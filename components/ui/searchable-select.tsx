import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import DynamicIcon from './dynamic-icon';
import { Search } from 'lucide-react-native';

type Option = {
  id: string;
  label: string;
};

type SearchableSelectProps = {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  options: Option[];
  value: string | null;
  onChange: (value: string, label: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  testID?: string;
  onSearch?: (query: string) => void;
  isSearching?: boolean;
  searchResults?: Option[];
  showSearchIcon?: boolean;
  maxHeight?: number;
  renderItem?: (props: { item: Option; index: number }) => React.ReactElement;
};

const SearchableSelect = ({
  label,
  placeholder = 'Seleccionar',
  searchPlaceholder = 'Buscar...',
  options,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  testID,
  onSearch,
  isSearching = false,
  searchResults,
  showSearchIcon = true,
  maxHeight = 200,
  renderItem,
}: SearchableSelectProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayOptions, setDisplayOptions] = useState<Option[]>(options);

  // Determinar qué opciones mostrar (resultados de búsqueda o opciones originales)
  useEffect(() => {
    if (searchResults && onSearch) {
      setDisplayOptions(searchResults);
    } else if (searchQuery) {
      // Filtrado local si no se proporciona onSearch
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayOptions(filtered);
    } else {
      setDisplayOptions(options);
    }
  }, [searchQuery, options, searchResults]);

  const selectedOption = options.find(option => option.id === value);

  const toggleOptions = () => {
    if (!disabled) {
      setShowOptions(!showOptions);
      // Limpiar la búsqueda al abrir el modal
      if (!showOptions) {
        setSearchQuery('');
        setDisplayOptions(options);
      }
    }
  };

  const handleSelect = (option: Option) => {
    onChange(option.id, option.label);
    setShowOptions(false);
    setSearchQuery('');
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (onSearch) {
      onSearch(text);
    }
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
        } rounded-xl p-3 flex-row justify-between items-center ${
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
      {error && <Text className="text-sm text-red-500">{error}</Text>}
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
          <View className="overflow-hidden mx-4 bg-white rounded-xl shadow-lg">
            <View className="px-4 py-3 border-b border-gray-100">
              <Text className="text-lg font-geist-medium">
                {label || 'Seleccionar opción'}
              </Text>
            </View>
            <View className="px-4 py-2 border-b border-gray-100">
              <View className="flex-row items-center rounded-xl border border-gray-200">
                {showSearchIcon && (
                  <Search
                    size={20}
                    color="#6B7280"
                    style={{ marginLeft: 12 }}
                  />
                )}
                <TextInput
                  placeholder={searchPlaceholder}
                  className="flex-1 p-3"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoFocus
                />
              </View>
            </View>
            {isSearching && (
              <View className="flex-row justify-center items-center py-4">
                <ActivityIndicator size="small" color="#000" />
                <Text className="ml-2 text-gray-500">Buscando...</Text>
              </View>
            )}
            {!isSearching && (
              <FlatList
                data={displayOptions}
                keyExtractor={item => item.id}
                renderItem={
                  renderItem
                    ? props => (
                        <TouchableOpacity
                          onPress={() => handleSelect(props.item)}
                          activeOpacity={0.7}
                        >
                          {renderItem(props)}
                        </TouchableOpacity>
                      )
                    : ({ item }) => (
                        <TouchableOpacity
                          className={`py-3 px-4 border-b border-gray-100 ${
                            item.id === value ? 'bg-gray-50' : ''
                          }`}
                          onPress={() => handleSelect(item)}
                        >
                          <Text
                            className={`${
                              item.id === value ? 'font-geist-medium' : ''
                            }`}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )
                }
                style={{ maxHeight }}
                ListEmptyComponent={
                  !value ? null : (
                    <View className="justify-center items-center py-4">
                      <Text className="text-gray-500">
                        No se encontraron resultados
                      </Text>
                    </View>
                  )
                }
              />
            )}
            <View className="p-2 border-t border-gray-100">
              <TouchableOpacity
                className="items-center py-2"
                onPress={() => setShowOptions(false)}
              >
                <Text className="text-gray-600 font-geist-medium">
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
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
  },
});

export default SearchableSelect;
