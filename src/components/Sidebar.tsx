import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getProfileById } from "@/services/profiles";
import SupabaseImage from "./SupabaseImage";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";

type SidebarProps = {
  isVisible: boolean;
  onClose: () => void;
};

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfileById(user!.id),
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  const renderProfileSection = () => (
    <View className="flex-1">
      <View className="p-4 border-b border-neutral-700">
        <View className="flex-row items-center gap-3 mb-4">
          {profile?.avatar_url ? (
            <SupabaseImage
              bucket="avatars"
              path={profile.avatar_url}
              className="w-16 h-16 rounded-full"
              transform={undefined}
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-neutral-800 items-center justify-center">
              <Feather name="user" size={28} color="#FFFFFF" />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-white text-lg font-bold">
              {profile?.full_name || "User"}
            </Text>
            <Text className="text-neutral-300 text-sm">
              @{profile?.username || "username"}
            </Text>
          </View>
        </View>
        
        <Text className="text-neutral-300 text-sm leading-snug">
          {profile?.bio || "No bio available"}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4 space-y-2">
          <Link href="/profile/edit" asChild>
            <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-lg bg-neutral-800">
              <Feather name="edit-3" size={20} color="#FFFFFF" />
              <Text className="text-white">Edit Profile</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-lg bg-neutral-800">
            <Feather name="settings" size={20} color="#FFFFFF" />
            <Text className="text-white">Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-lg bg-neutral-800">
            <Feather name="help-circle" size={20} color="#FFFFFF" />
            <Text className="text-white">Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-3 p-3 rounded-lg bg-neutral-800">
            <Feather name="info" size={20} color="#FFFFFF" />
            <Text className="text-white">About</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View className="p-4 border-t border-neutral-700">
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-2 p-3 rounded-lg bg-red-600"
        >
          <Feather name="power" size={20} color="white" />
          <Text className="text-white font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#101010]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-neutral-700">
          <Text className="text-white text-xl font-bold">Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Navigation Tabs */}
        <View className="flex-row border-b border-neutral-700">
          <TouchableOpacity
            onPress={() => setActiveSection("profile")}
            className={`flex-1 p-3 ${
              activeSection === "profile" ? "border-b-2 border-blue-500" : ""
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeSection === "profile" ? "text-blue-500" : "text-neutral-400"
              }`}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {renderProfileSection()}
      </View>
    </Modal>
  );
}
