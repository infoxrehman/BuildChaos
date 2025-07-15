import { ScrollView, StyleSheet, SafeAreaView } from "react-native";
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
      <EventListItem event={events[0]} />
      <EventListItem event={events[1]} />
      <EventListItem event={events[2]} />
    </>
  );
}
