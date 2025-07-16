import { Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import events from "assets/events.json";
import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function EventPage() {
  const { id } = useLocalSearchParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
    setEvent(data);
    setLoading(true);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <View className="flex-1 gap-3 mt-2 bg-white rounded-t-3xl p-3">
      <Stack.Screen
        options={{ title: "Event", headerBackTitleVisible: false }}
      />
      <Image
        source={{ uri: event.image_uri }}
        className="aspect-video w-full rounded-xl"
      />
      <Text className="text-xl font-bold text-black" numberOfLines={2}>
        {event.title}
      </Text>
      <Text className="text-lg font-semibold uppercase text-black">
        {dayjs(event.datetime).format("ddd, D MMM")} .{" "}
        {dayjs(event.datetime).format("h:mm A")}
      </Text>

      <Text className="text-lg text-black" numberOfLines={2}>
        {event.description}
      </Text>

      <View className="absolute bottom-0 left-0 right-0 flex-row border-t-2 border-gray-300 p-5 justify-between items-center">
        <Text className="text-xl font-semibold">Free</Text>
        <Pressable className="bg-red-400 rounded-xl p-5 px-8">
          <Text className="text-lg font-bold text-white"> Join and RSVP</Text>
        </Pressable>
      </View>
    </View>
  );
}
