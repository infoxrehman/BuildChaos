import { Link, router } from "expo-router";
import {
  Pressable,
  TextInput,
  View,
  RefreshControl,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useQuery } from "@tanstack/react-query";
import { fetchShowcase } from "@/services/showcase";
import ShowcaseListItem from "@/components/ShowcaseListItem";

export default function Showcase() {

  const { data, refetch, isRefetching } = useQuery({
    queryKey: ["showcase"],
    queryFn: fetchShowcase,
  });

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
      data={data}
      renderItem={({ item }) => <ShowcaseListItem project={item} />}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
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
