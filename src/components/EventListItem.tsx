import { Text, Image, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

export default function EventListItem({ event }) {
  return (
    <View className="gap-3 p-3 m-4 rounded-xl bg-white">
      <View className="flex-row">
        <View className="flex-1 gap-2">
          <Text className="text-lg font-semibold uppercase text-amber-800">
            Wed 13, Sep .19:30 CET
          </Text>
          <Text className="text-black font-bold text-xl" numberOfLines={2}>
            {event.title}
          </Text>
          <Text className="text-gray-700">{event.location}</Text>
        </View>
        <Image
          source={{
            uri: event.image,
          }}
          className="w-2/5 aspect-video rounded-lg"
        />
      </View>

      <View className="flex-row gap-3">
        <Text className="mr-auto text-gray-700">16 going</Text>
        <Feather name="share" size={20} color="gray" />
        <Feather name="bookmark" size={24} color="gray" />
      </View>
    </View>
  );
}
