import { ScrollView, StyleSheet, SafeAreaView, FlatList } from "react-native";
import ExploreHeader from "../../../components/ExploreHeader";
import CommunitiesSection from "../../../components/CommunitiesSection";
import TechEventsSection from "../../../components/TechEventsSection";
import HackathonsSection from "../../../components/HackathonsSection";

import EventListItem from "@/components/EventListItem";

import events from "assets/events.json";
const event = events[0];

export default function Explore() {
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
      <FlatList
        data={events}
        renderItem={({ item }) => <EventListItem event={item} />}
      />
    </>
  );
}
