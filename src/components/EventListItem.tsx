import { Text, Image, View, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import dayjs from "dayjs";
import { Link } from "expo-router";

export default function EventListItem({ event }) {
  return (
    <Link href={`/event/${event.id}`} asChild>
      <Pressable className="gap-3 pb-3 p-3 m-3 rounded-xl bg-white/20">
        <View className="flex-row">
          <View className="flex-1 gap-2">
            <Text className="text-lg font-semibold uppercase text-white">
              {dayjs(event.datetime).format("ddd, D MMM")} .{" "}
              {dayjs(event.datetime).format("h:mm A")}
            </Text>
            <Text className="text-white font-bold text-xl" numberOfLines={2}>
              {event.title}
            </Text>

            <Text className="text-white">{event.location}</Text>
          </View>
          <Image
            source={{
              uri: event.image,
            }}
            className="w-2/5 aspect-video rounded-lg"
          />
        </View>

        <View className="flex-row gap-3">
          <Text className="mr-auto text-white">16 going</Text>
          <Feather name="share" size={20} color="gray" />
          <Feather name="bookmark" size={24} color="gray" />
        </View>
      </Pressable>
    </Link>
  );
}
