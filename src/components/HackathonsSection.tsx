import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import SectionCard from "./SectionCard";
import { SectionItem } from "../types";

const HackathonsSection = () => {
  const hackathons: SectionItem[] = [
    {
      id: "1",
      title: "Global Hack Week",
      description: "Week-long coding marathon",
      date: "Dec 1-7, 2023",
      location: "Online",
    },
    {
      id: "2",
      title: "Blockchain Hackathon",
      description: "Build decentralized apps",
      date: "Jan 15-17, 2024",
      location: "Virtual",
    },
  ];

  const handlePress = (item: SectionItem) => {
    console.log("Pressed:", item.title);
    // Navigate to hackathon details
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Hackathons</Text>
      <FlatList
        data={hackathons}
        renderItem={({ item }) => (
          <SectionCard item={item} onPress={() => handlePress(item)} />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
});

export default HackathonsSection;
