import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function TransactionTabs({
  activeTab,
  setActiveTab,
  tabs,
}: {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<any>>;
  tabs: { id: string; label: string }[];
}) {
  return (
    <View className="w-full border-b border-gray-200">
      <View className="flex-row">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            className={`flex-1 items-center px-5 py-4 ${
              activeTab === tab.id ? 'border-b-2 border-black' : ''
            }`}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Text
              className={`font-geist-semibold ${
                activeTab === tab.id ? 'text-black' : 'text-gray-500'
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
