import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SectionItem } from "../types";

interface SectionCardProps {
  item: SectionItem;
  onPress?: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white/30 p-3 rounded-xl m-2 border border-gray-500"
    >
      <View className="flex-1">
        <Text className="text-black text-xl font-semibold">{item.title}</Text>
        {item.description && (
          <Text className="text-gray-500 text-lg">{item.description}</Text>
        )}
        {item.date && (
          <Text className="text-gray-500 text-sm">{item.date}</Text>
        )}
        {item.location && (
          <Text className="text-gray-400  text-sm">{item.location}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SectionCard;
