import { TextInput, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CreateEvent() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white rounded-t-2xl mt-8 ml-4 mr-4">
      <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
        <Ionicons
          className="mt-4"
          name="chevron-back-outline"
          size={28}
          color="black"
        />
      </Pressable>
      <TextInput
        className="rounded-md border border-gray-400 p-3 ml-4 mt-4 mr-4 text-black"
        placeholder="Title"
        placeholderTextColor="gray"
      />
      <TextInput
        className="rounded-md border min-h-32 border-gray-400 p-3 ml-4 mt-4 mr-4 text-black"
        placeholder="Description"
        multiline
        numberOfLines={3}
        placeholderTextColor="gray"
      />
    </View>
  );
}
