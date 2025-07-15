import { Stack, useLocalSearchParams } from "expo-router";
import { Image, Text, View } from "react-native";

import events from "assets/events.json";
import dayjs from "dayjs";

export default function EventPage() {
  const { id } = useLocalSearchParams();

  const event = events.find((e) => e.id == id);

  if (!event) {
    return <Text>Event not found</Text>;
  }

  return (
    <View className="flex-1 gap-3 bg-white rounded-t-3xl p-3">
      <Stack.Screen
        options={{ title: "Event", headerBackTitleVisible: false }}
      />
      <Image
        source={{ uri: event.image }}
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
    </View>
  );
}
