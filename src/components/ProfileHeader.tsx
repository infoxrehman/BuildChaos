import { useQuery } from "@tanstack/react-query";
import { getProfileById } from "@/services/profiles";
import { View, Text, ActivityIndicator, Image, Pressable } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { Link } from "expo-router";
import SupabaseImage from "./SupabaseImage";
import { supabase } from "@/lib/supabase";
import { Feather } from "@expo/vector-icons";

export default function ProfileHeader() {
  const { user } = useAuth();

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text className="text-white">Error: {error.message}</Text>;
  console.log(JSON.stringify(profile, null, 2));

  return (
    <View className="p-4 gap-4">
      <Pressable
        className="ml-auto flex-row items-center rounded-lg bg-[#F25F33] p-3 px-4 w-30 mb-2"
        onPress={() => supabase.auth.signOut()}
      >
        <Feather name="power" size={20} color="white" />
        <Text className="text-lg font-bold text-white ml-2">Log off</Text>
      </Pressable>
      <View className="flex-row items-center justify-between gap-2">
        <View className="gap-1">
          <Text className="text-white text-2xl font-bold">
            {profile?.full_name}
          </Text>
          <Text className="text-neutral-200 text-lg">~{profile?.username}</Text>
        </View>

        {profile?.avatar_url ? (
          <SupabaseImage
            bucket="avatars"
            path={profile.avatar_url}
            className="w-24 h-24 rounded-full" transform={undefined}          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-neutral-800 items-center justify-center">
            <Feather name="user" size={28} color="#FFFFFF" />
          </View>
        )}
      </View>

      <Text className="text-neutral-200 leading-snug">{profile?.bio}</Text>

      <View className="flex-row gap-2">
        <Link href="/profile/edit" asChild>
          <Pressable className="flex-1 py-2 rounded-lg border-2 border-neutral-800">
            <Text className="text-center text-neutral-200">Edit Profile</Text>
          </Pressable>
        </Link>
{/* 
        <Pressable className="flex-1 py-2 rounded-lg border-2 border-neutral-800">
          <Text className="text-center text-neutral-200">Share Profile</Text>
        </Pressable> */}
      </View>
    </View>
  );
}
