import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  Text,
} from "react-native";
import ExploreHeader from "../../../../components/ExploreHeader";
import CommunitiesSection from "../../../../components/CommunitiesSection";
import TechEventsSection from "../../../../components/TechEventsSection";
import HackathonsSection from "../../../../components/HackathonsSection";

import EventListItem from "@/components/EventListItem";

import { Link, Stack } from "expo-router";
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
      <Stack.Screen options={{ title: "" }} />
      <FlatList
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <SafeAreaView>
        <Pressable
          onPress={() => {}}
          className="bg-red-400 rounded-xl p-5 px-8"
        >
          <Link href="/(protected)/(tabs)/event/create" asChild>
            <Text className="text-lg font-bold text-white">Create event</Text>
          </Link>
        </Pressable>
      </SafeAreaView>
    </>
  );
}
