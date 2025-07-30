import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CreateShowcase() {
  const [projectImage, setProjectImage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [banners, setBanners] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (isBanner = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (isBanner) {
        if (banners.length < 5) {
          setBanners([...banners, result.assets[0].uri]);
        } else {
          Alert.alert("Maximum 5 banners allowed");
        }
      } else {
        setProjectImage(result.assets[0].uri);
      }
    }
  };

  const removeBanner = (index: number) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  const uploadImage = async (uri: string, path: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from("showcase-images")
      .upload(path, blob);

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Title and description are required");
      return;
    }

    setIsLoading(true);

    try {
      // Upload project image
      let projectImagePath = null;
      if (projectImage) {
        projectImagePath = await uploadImage(
          projectImage,
          `projects/${Date.now()}_project.jpg`
        );
      }

      const bannerPaths = await Promise.all(
        banners.map((banner, index) =>
          uploadImage(banner, `banners/${Date.now()}_${index}.jpg`)
        )
      );
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("showcase")
        .insert([
          {
            title,
            description,
            creator_name: creatorName,
            project_url: projectUrl,
            project_image: projectImagePath,
            banners: bannerPaths,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;

      Alert.alert("Success", "Project created successfully!");
      setTitle("");
      setDescription("");
      setCreatorName("");
      setProjectUrl("");
      setProjectImage(null);
      setBanners([]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="p-4 flex-1">
      <Pressable onPress={() => router.back()} className="p-2">
        <Ionicons name="chevron-back-outline" size={28} color="white" />
      </Pressable>
      <View className="mb-4">
        <Pressable
          onPress={() => pickImage(false)}
          className="p-4 mt-4 rounded-lg items-center justify-center h-40 border-2 border-dashed border-gray-400"
        >
          {projectImage ? (
            <Image
              source={{ uri: projectImage }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center">
              <Ionicons name="image-outline" size={32} color="white" />
              <Text className="text-white mt-2">Select Project Image</Text>
            </View>
          )}
        </Pressable>
      </View>

      <TextInput
        placeholder="Project Title"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
        className="bg-neutral-800 border border-neutral-70 placeholder:text-gray-500 focus:border-blue-500 text-white p-3 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Project Description"
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        className="bg-neutral-800 border border-neutral-700 placeholder:text-gray-500 focus:border-blue-500 text-white p-3 rounded-lg mb-4 h-32"
      />

      <TextInput
        placeholder="Creator Name"
        placeholderTextColor="#999"
        value={creatorName}
        onChangeText={setCreatorName}
        className="bg-neutral-800 border border-neutral-70 placeholder:text-gray-500 focus:border-blue-500 text-white p-3 rounded-lg mb-4"
      />

      <TextInput
        placeholder="Project URL (optional)"
        placeholderTextColor="#999"
        value={projectUrl}
        onChangeText={setProjectUrl}
        className="bg-neutral-800 border border-neutral-700 placeholder:text-gray-500 focus:border-blue-500 text-white p-3 rounded-lg mb-4"
      />

      <View className="mb-6">
        <Text className="text-white mb-2">Banners (up to 5)</Text>
        <View className="flex-row flex-wrap">
          {banners.map((banner, index) => (
            <View key={index} className="relative mr-2 mb-2">
              <Image
                source={{ uri: banner }}
                className="w-20 h-20 rounded-lg"
              />
              <Pressable
                onPress={() => removeBanner(index)}
                className="absolute top-1 right-1 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              >
                <Ionicons name="close" size={16} color="white" />
              </Pressable>
            </View>
          ))}
          {banners.length < 5 && (
            <Pressable
              onPress={() => pickImage(true)}
              className="bg-neutral-800 w-20 h-20 rounded-lg items-center justify-center"
            >
              <Ionicons name="add" size={24} color="white" />
            </Pressable>
          )}
        </View>
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={isLoading}
        className="bg-red-500 p-4 rounded-lg items-center justify-center"
      >
        <Text className="text-white font-bold text-lg">
          {isLoading ? "Creating..." : "Submit project"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
