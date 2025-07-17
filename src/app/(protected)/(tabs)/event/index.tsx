import { ScrollView, StyleSheet, SafeAreaView, FlatList } from "react-native";
import ExploreHeader from "../../../../components/ExploreHeader";
import CommunitiesSection from "../../../../components/CommunitiesSection";
import TechEventsSection from "../../../../components/TechEventsSection";
import HackathonsSection from "../../../../components/HackathonsSection";

import EventListItem from "@/components/EventListItem";

import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Explore() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from("events").select("*");
    setEvents(data);
  };

  return (
    // <SafeAreaView>
    //   <ScrollView>
    //     <ExploreHeader />
    //     <CommunitiesSection />
    //     <TechEventsSection />
    //     <HackathonsSection />
    //   </ScrollView>
    // </SafeAreaView>

    <>
      <Stack.Screen options={{ title: "Events" }} />
      <FlatList
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
      />
    </>
  );
}
