import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createShowcase } from '@/services/showcase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from "expo-file-system";


export default function CreateShowcase() {
  // State management
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectImage, setProjectImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [banners, setBanners] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);

  // Image picker handler
  const pickImage = async (isBanner = false) => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        if (isBanner) {
          if (banners.length < 5) {
            setBanners([...banners, result.assets[0]]);
          } else {
            Alert.alert('Maximum 5 banners allowed');
          }
        } else {
          setProjectImage(result.assets[0]);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Remove banner handler
  const removeBanner = (index: number) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  // WORKING IMAGE UPLOAD FUNCTION
  const uploadImage = async (projectImage: ImagePicker.ImagePickerAsset, p0: string) => {
    if (!image) return;
  
    const fileExt = image.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
    const path = `${Date.now()}.${fileExt}`;
  
    const base64 = await FileSystem.readAsStringAsync(image.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  
    const blob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], {
      type: image.mimeType ?? "image/jpeg",
    });
  
    const { data, error: uploadError } = await supabase.storage
      .from("showcase-images")
      .upload(path, blob, {
        contentType: image.mimeType ?? "image/jpeg",
      });
  
    if (uploadError) {
      throw uploadError;
    }
  
    return data.path;
  };

  // Mutation for creating showcase
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // Validate required fields
      if (!title || !description) {
        throw new Error('Title and description are required');
      }

      // Upload project image
      let projectImageUrl = null;
      if (projectImage) {
        projectImageUrl = await uploadImage(projectImage, 'projects');
      }

      // Upload all banners
      const bannerUrls = await Promise.all(
        banners.map((banner) => uploadImage(banner, 'banners'))
      );

      // Create the showcase
      return createShowcase({
        title,
        description,
        creator_id: profile?.id,
        creator_name: creatorName || profile?.full_name || 'Anonymous',
        project_url: projectUrl,
        project_image: projectImageUrl,
        banners: bannerUrls,
        created_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      Alert.alert('Success', 'Showcase created successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setCreatorName('');
      setProjectUrl('');
      setProjectImage(null);
      setBanners([]);
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['showcases'] });
      // Navigate back
      router.back();
    },
    onError: (error) => {
      console.error('Create showcase error:', error);
      Alert.alert('Error', error.message || 'Failed to create showcase');
    },
  });

  // UI Components
  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      {/* Header with back button */}
      <Pressable onPress={() => router.back()} className="p-2 mb-4">
        <Ionicons name="chevron-back-outline" size={28} color="white" />
      </Pressable>

      {/* Project Image Upload */}
      <View className="mb-6">
        <Text className="text-white text-lg mb-2 font-semibold">Project Image</Text>
        <Pressable
          onPress={() => pickImage(false)}
          className="rounded-lg items-center justify-center h-48 border-2 border-dashed border-gray-500 bg-gray-800"
        >
          {projectImage ? (
            <Image
              source={{ uri: projectImage.uri }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center p-4">
              <Ionicons name="image-outline" size={40} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2 text-center">
                Tap to select a main image
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Project Details Form */}
      <TextInput
        placeholder="Project Title *"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
        className="bg-gray-800 border border-gray-700 text-white p-4 rounded-lg mb-4 text-lg"
      />

      <TextInput
        placeholder="Project Description *"
        placeholderTextColor="#9CA3AF"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        className="bg-gray-800 border border-gray-700 text-white p-4 rounded-lg mb-4 h-40 text-lg"
      />

      <TextInput
        placeholder="Creator Name"
        placeholderTextColor="#9CA3AF"
        value={creatorName}
        onChangeText={setCreatorName}
        className="bg-gray-800 border border-gray-700 text-white p-4 rounded-lg mb-4 text-lg"
      />

      <TextInput
        placeholder="Project URL (optional)"
        placeholderTextColor="#9CA3AF"
        value={projectUrl}
        onChangeText={setProjectUrl}
        keyboardType="url"
        className="bg-gray-800 border border-gray-700 text-white p-4 rounded-lg mb-6 text-lg"
      />

      {/* Banners Section */}
      <View className="mb-8">
        <Text className="text-white text-lg mb-3 font-semibold">
          Additional Banners (up to 5)
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {banners.map((banner, index) => (
            <View key={index} className="relative">
              <Image
                source={{ uri: banner.uri }}
                className="w-20 h-20 rounded-lg"
              />
              <Pressable
                onPress={() => removeBanner(index)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center"
              >
                <Ionicons name="close" size={16} color="white" />
              </Pressable>
            </View>
          ))}
          {banners.length < 5 && (
            <Pressable
              onPress={() => pickImage(true)}
              className="bg-gray-800 w-20 h-20 rounded-lg items-center justify-center border border-dashed border-gray-500"
            >
              <Ionicons name="add" size={24} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={() => mutate()}
        disabled={isPending}
        className={`p-5 rounded-lg items-center justify-center mb-8 ${
          isPending ? 'bg-red-700' : 'bg-red-600'
        }`}
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold text-lg">Publish Showcase</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}