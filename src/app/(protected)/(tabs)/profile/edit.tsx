import { View, Text, TextInput, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileById, updateProfile } from "@/services/profiles";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import UserAvatarPicker from "@/components/UserAvatarPicker";

export default function ProfileEditScreen() {
  const [name, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: profile,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateProfile(user!.id, {
        name: name,
        bio,
        avatar_url: avatarUrl,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      router.back();
    },
  });

  useEffect(() => {
    setFullName(profile?.name ?? "");
    setBio(profile?.bio ?? "");
  }, [profile?.id]);

  return (
    <View className="flex-1 p-4 gap-4">
      <UserAvatarPicker
        currentAvatar={profile?.avatar_url ?? ""}
        onUpload={setAvatarUrl}
      />
      <TextInput
        value={name}
        onChangeText={setFullName}
        placeholder="Full Name"
        className="text-white border-2 border-neutral-700 rounded-md p-4"
      />

      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
        className="text-white border-2 border-neutral-700 rounded-md p-4"
        multiline
        numberOfLines={5}
      />

      <View className="mt-auto">
        <Pressable
          onPress={() => mutate()}
          className={`${
            isPending ? "bg-white/50" : "bg-white"
          } p-4 items-center rounded-full`}
          disabled={isPending}
        >
          <Text className="text-black font-bold">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
