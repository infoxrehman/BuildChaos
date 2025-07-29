import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getProfileById } from "@/services/profiles";
import SupabaseImage from "../../../../components/SupabaseImage";
import { useAuth } from "@/providers/AuthProvider";

export default function DexScreen() {
  const { user } = useAuth();

  const {
    data: profile,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-500 mb-4">Error loading profile</Text>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded"
          onPress={() => refetch()}
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="bg-white rounded-t-3xl mt-12"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="p-4 border border-gray-500 rounded-xl m-4">
        <View className="flex-row items-center gap-4">
          <SupabaseImage
            bucket="avatars"
            path={profile.avatar_url}
            className="w-20 h-20 rounded-full"
          />
          <View className="flex-1 gap-1">
            <Text className="text-neutral-800 text-xl font-semibold">
              {profile?.full_name}
            </Text>
            <Text className="text-neutral-600 text-base">
              ~{profile?.username}
            </Text>
            <Text className="text-neutral-400 text-sm leading-tight">
              {profile?.bio}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
