import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";

import dayjs from "dayjs";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";

export default function EventPage() {
  const { id } = useLocalSearchParams();

  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

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
    setLoading(false);

    const { data: attendanceData } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id)
      .eq("event_id", id)
      .single();

    setAttendance(attendanceData);
  };

  const joinEvent = async () => {
    const { data, error } = await supabase
      .from("attendance")
      .insert({ user_id: user.id, event_id: event.id })
      .select()
      .single();

    setAttendance(data);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <View className="flex-1 gap-3 mt-2 bg-white rounded-t-3xl p-3">
      <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
        <Ionicons
          className="mt-4"
          name="chevron-back-outline"
          size={28}
          color="black"
        />
      </Pressable>
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
        {dayjs(event.date).format("ddd, D MMM")} .{" "}
        {dayjs(event.date).format("h:mm A")}
      </Text>

      <Text className="text-lg text-black" numberOfLines={2}>
        {event.description}
      </Text>

      <Link
        href={`/event/${event.id}/attendance`}
        className="text-lg"
        numberOfLines={2}
      >
        View attendes
      </Link>

      <View className="absolute bottom-0 left-0 right-0 flex-row border-t-2 border-gray-300 p-5 justify-between items-center">
        <Text className="text-xl font-semibold">Free</Text>

        {attendance ? (
          <Text className="font-bold text-green-500">You are attending</Text>
        ) : (
          <Pressable
            onPress={() => joinEvent()}
            className="bg-red-400 rounded-xl p-5 px-8"
          >
            <Text className="text-lg font-bold text-white">Join and RSVP</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
