import { Alert, Image, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import SupabaseImage from "./SupabaseImage";

export default function UserAvatarPicker({
  currentAvatar,
  onUpload,
}: {
  currentAvatar: string;
  onUpload: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function uploadAvatar() {
    try {
      setUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
        exif: false,
      });
      if (result.canceled || !result.assets || result.assets.length == 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      console.log("Got image", image);
      if (!image.uri) {
        throw new Error("No image uri");
      }
      const arraybuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );
      const flieExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      const path = `${Date.now()}.${flieExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, arraybuffer, {
          contentType: image.mimeType ?? "image/jpeg",
        });
      if (uploadError) {
        throw uploadError;
      }
      onUpload(data.path);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      } else {
        throw error;
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <Pressable onPress={uploadAvatar} className="self-center">
      <SupabaseImage
        bucket="avatars"
        path={currentAvatar}
        className="w-24 h-24 rounded-full self-center"
      />
    </Pressable>
  );
}
