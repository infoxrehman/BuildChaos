import { Link, router } from "expo-router";
import {
  Pressable,
  Text,
  TextInput,
  View,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Showcase() {
  const projects = [
    {
      id: "1",
      title: "DevConnect",
      description: "A Pair Programming Web App",
      votes: 3,
    },
    {
      id: "2",
      title: "Ghar Ka Coder",
      description: "Code, Connect, and Earn Rewards",
      votes: 2,
    },
    {
      id: "3",
      title: "GHAIR KA CODER",
      description: "A User Network Product ©",
      votes: 1,
    },
    {
      id: "3",
      title: "GHAIR KA CODER",
      description: "A User Network Product ©",
      votes: 1,
    },
    {
      id: "3",
      title: "GHAIR KA CODER",
      description: "A User Network Product ©",
      votes: 1,
    },
  ];

  const imageUris = {
    banner:
      "https://nfxzczdhrcdiachkwyeh.supabase.co/storage/v1/object/sign/app-images/showcase.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81NTdkMmNjYi0yOGQ0LTQ4OWMtODM5NS03MDI3YmVmNDA3MWMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcHAtaW1hZ2VzL3Nob3djYXNlLnBuZyIsImlhdCI6MTc1Mzg2Njg1NSwiZXhwIjoyMDY5MjI2ODU1fQ.uedtsThruMwRtBXVrRBlNQVhxdY89GH205PSkPQLQQI",
  };

  return (
    <View className="flex-1">
      <Pressable onPress={() => router.back()} className="p-2 mt-2">
        <Ionicons name="chevron-back-outline" size={28} color="white" />
      </Pressable>

      <Image
        source={{ uri: imageUris.banner }}
        className="w-full h-auto aspect-[2/1] rounded-xl p-2"
      />

      <View className="flex-row items-center bg-[#424242] rounded-xl p-4 mx-2 my-2">
        <Ionicons name="search" size={20} color="white" />
        <TextInput
          className="ml-2 flex-1 text-white"
          placeholder="Search"
          placeholderTextColor="white"
        />
      </View>

      <View className="flex-1">
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <Pressable className="flex-row bg-[#303030] rounded-xl p-4 mx-2 my-2 shadow-sm shadow-black/10">
              <Image
                source={{ uri: imageUris.banner }}
                className="w-[96] h-[96] rounded-xl"
              />

              <View className="flex-1 m-3">
                <Text className="font-bold text-lg text-white">
                  {item.title}
                </Text>
                <Text className="text-white">{item.description}</Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-4">
                <Text className="font-bold">{item.votes}</Text>
              </View>
            </Pressable>
          )}
        />
        <Pressable
          className="absolute bg-red-500 rounded-full p-4 right-4 bottom-4 shadow-lg shadow-black/30"
          style={{
            elevation: 5,
          }}
        >
          <Link href="/(protected)/(tabs)/(explore)/showcase/create" asChild>
            <Ionicons name="add-outline" size={32} color="white" />
          </Link>
        </Pressable>
      </View>
    </View>
  );
}
