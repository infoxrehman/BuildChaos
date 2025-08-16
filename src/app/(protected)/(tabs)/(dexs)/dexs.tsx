import { useQuery } from "@tanstack/react-query";
import {
  View,
  Text,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getProfileById } from "@/services/profiles";
import SupabaseImage from "../../../../components/SupabaseImage";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function DexScreen() {
  const { user } = useAuth();

  const {
    data: profile,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  const router = useRouter();

  const handlePress = () => {
    router.push("/(protected)/(tabs)/(dexs)/details");
  };

  return (
    <ScrollView
      className="bg-white rounded-t-3xl mt-12"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <TouchableOpacity onPress={handlePress}>
        <View className="p-4 border border-gray-500 rounded-xl m-4">
          <View className="flex-row items-center gap-4">
          {profile.avatar_url ? (
          <SupabaseImage
            bucket="avatars"
            path={profile.avatar_url}
            className="w-20 h-20 rounded-full" transform={undefined}          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-neutral-800 items-center justify-center">
            <Feather name="user" size={28} color="#FFFFFF" />
          </View>
        )}
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
      </TouchableOpacity>
    </ScrollView>
  );
}
