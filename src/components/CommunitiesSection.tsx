import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import SectionCard from "./SectionCard";
import { SectionItem } from "../types";

const CommunitiesSection = () => {
  const communities: SectionItem[] = [
    {
      id: "1",
      title: "React Native Developers",
      description: "Community for RN enthusiasts",
      location: "Online",
    },
    {
      id: "2",
      title: "AI & ML Enthusiasts",
      description: "Discuss latest in AI/ML",
      location: "Online",
    },
    {
      id: "3",
      title: "Web3 Builders",
      description: "Blockchain and Web3 technologies",
      location: "Online",
    },
  ];

  const handlePress = (item: SectionItem) => {
    console.log("Pressed:", item.title);
    // Navigate to community details
  };

  return (
    <View className="p-6 bg-white rounded-xl m-4">
      <Text className="font-bold text-2xl text-black">Communities</Text>
      <FlatList
        className="mt-4"
        data={communities}
        renderItem={({ item }) => (
          <SectionCard item={item} onPress={() => handlePress(item)} />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

export default CommunitiesSection;
