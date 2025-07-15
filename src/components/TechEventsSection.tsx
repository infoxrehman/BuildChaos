import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import SectionCard from "./SectionCard";
import { SectionItem } from "../types";

const TechEventsSection = () => {
  const events: SectionItem[] = [
    {
      id: "1",
      title: "Tech Conference 2023",
      description: "Annual technology conference",
      date: "Oct 15-17, 2023",
      location: "San Francisco, CA",
    },
    {
      id: "2",
      title: "Mobile Dev Summit",
      description: "Focus on mobile technologies",
      date: "Nov 5-6, 2023",
      location: "New York, NY",
    },
  ];

  const handlePress = (item: SectionItem) => {
    console.log("Pressed:", item.title);
    // Navigate to event details
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tech Events</Text>
      <FlatList
        data={events}
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
});

export default TechEventsSection;
