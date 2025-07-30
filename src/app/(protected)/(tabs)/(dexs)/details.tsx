import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { getProfileById } from "@/services/profiles";
import { Ionicons } from "@expo/vector-icons";
import SupabaseImage from "@/components/SupabaseImage";

export default function CommunityDetailScreen() {
  const { user } = useAuth();
  const {
    data: profile,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  return (
    <ScrollView
      className="bg-white rounded-t-3xl h-full"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View className="p-4">
        <Pressable onPress={() => router.back()} className="p-2">
          <Ionicons name="chevron-back-outline" size={28} color="black" />
        </Pressable>

        <View className="flex-row items-center mb-4">
          <SupabaseImage
            bucket="avatars"
            path={profile.avatar_url}
            className="w-20 h-20 rounded-full"
          />
          <View>
            <Text className="text-xl font-bold">{profile?.full_name}</Text>
            {profile?.updated_at && (
              <Text className="text-gray-500 text-sm">
                Last updated:{" "}
                {new Date(profile.updated_at).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>

        {profile?.bio && (
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">About</Text>
            <Text className="text-gray-700">{profile.bio}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
