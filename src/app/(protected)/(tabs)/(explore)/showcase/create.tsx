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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectImage, setProjectImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [banners, setBanners] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const pickImage = async (isBanner = false) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true, // We need base64 for upload
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

  const removeBanner = (index: number) => {
    setBanners(banners.filter((_, i) => i !== index));
  };

  // Fixed upload image function
  const uploadImage = async (imageAsset: ImagePicker.ImagePickerAsset, folder: string) => {
    try {
      if (!imageAsset || !imageAsset.base64) {
        throw new Error('No image or base64 data available');
      }

      // Get file extension
      const fileExt = imageAsset.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      
      // Create unique filename with folder prefix
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Convert base64 to ArrayBuffer using the decode function
      const arrayBuffer = decode(imageAsset.base64);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("showcase-images")
        .upload(fileName, arrayBuffer, {
          contentType: imageAsset.mimeType ?? `image/${fileExt}`,
          upsert: false, // Don't overwrite existing files
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      if (!data?.path) {
        throw new Error('Upload succeeded but no path returned');
      }

      console.log('Image uploaded successfully:', data.path);
      return data.path;

    } catch (error) {
      console.error('Error in uploadImage:', error);
      throw error;
    }
  };

  // Alternative upload method using FileSystem (if base64 method fails)
  const uploadImageAlternative = async (imageAsset: ImagePicker.ImagePickerAsset, folder: string) => {
    try {
      if (!imageAsset || !imageAsset.uri) {
        throw new Error('No image URI available');
      }

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(imageAsset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Get file extension
      const fileExt = imageAsset.uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
      
      // Create unique filename
      const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(base64);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("showcase-images")
        .upload(fileName, arrayBuffer, {
          contentType: imageAsset.mimeType ?? `image/${fileExt}`,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      return data.path;

    } catch (error) {
      console.error('Error in uploadImageAlternative:', error);
      throw error;
    }
  };

  // Mutation for creating showcase
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // Validate required fields
      if (!title.trim()) {
        throw new Error('Title is required');
      }
      if (!description.trim()) {
        throw new Error('Description is required');
      }

      console.log('Starting showcase creation...');

      // Upload project image
      let projectImageUrl = null;
      if (projectImage) {
        console.log('Uploading project image...');
        try {
          projectImageUrl = await uploadImage(projectImage, 'projects');
        } catch (error) {
          console.log('Primary upload failed, trying alternative method...');
          projectImageUrl = await uploadImageAlternative(projectImage, 'projects');
        }
        console.log('Project image uploaded:', projectImageUrl);
      }

      // Upload all banners
      let bannerUrls: string[] = [];
      if (banners.length > 0) {
        console.log(`Uploading ${banners.length} banners...`);
        bannerUrls = await Promise.all(
          banners.map(async (banner, index) => {
            try {
              return await uploadImage(banner, 'banners');
            } catch (error) {
              console.log(`Banner ${index} primary upload failed, trying alternative...`);
              return await uploadImageAlternative(banner, 'banners');
            }
          })
        );
        console.log('Banners uploaded:', bannerUrls);
      }

      // Create the showcase
      const showcaseData = {
        title: title.trim(),
        description: description.trim(),
        creator_id: profile?.id,
        creator_name: creatorName.trim() || profile?.name || profile?.full_name || 'Anonymous',
        project_url: projectUrl.trim() || null,
        project_image: projectImageUrl,
        banners: bannerUrls.length > 0 ? bannerUrls : null,
        created_at: new Date().toISOString(),
      };

      console.log('Creating showcase with data:', showcaseData);
      return await createShowcase(showcaseData);
    },
    onSuccess: (data) => {
      console.log('Showcase created successfully:', data);
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
      Alert.alert(
        'Error', 
        error.message || 'Failed to create showcase. Please try again.'
      );
    },
  });

  return (
    <ScrollView className="flex-1 bg-gray-900 p-4">
      {/* Header with back button */}
      <Pressable onPress={() => router.back()} className="p-2 mb-4">
        <Ionicons name="chevron-back-outline" size={28} color="white" />
      </Pressable>

      <Text className="text-white text-2xl font-bold mb-6">Create Showcase</Text>

      {/* Project Image Upload */}
      <View className="mb-6">
        <Text className="text-white text-lg mb-2 font-semibold">Project Image</Text>
        <Pressable
          onPress={() => pickImage(false)}
          className="rounded-lg items-center justify-center h-48 border-2 border-dashed border-gray-500 bg-gray-800"
        >
          {projectImage ? (
            <View className="relative w-full h-full">
              <Image
                source={{ uri: projectImage.uri }}
                className="w-full h-full rounded-lg"
                resizeMode="cover"
              />
              <Pressable
                onPress={() => setProjectImage(null)}
                className="absolute top-2 right-2 bg-red-500 rounded-full w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="white" />
              </Pressable>
            </View>
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
        textAlignVertical="top"
      />

      <TextInput
        placeholder="Creator Name (optional)"
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
        autoCapitalize="none"
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
                resizeMode="cover"
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
        disabled={isPending || !title.trim() || !description.trim()}
        className={`p-5 rounded-lg items-center justify-center mb-8 ${
          isPending ? 'bg-gray-600' : (!title.trim() || !description.trim()) ? 'bg-gray-700' : 'bg-red-600'
        }`}
      >
        {isPending ? (
          <View className="flex-row items-center">
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white font-bold text-lg ml-2">Publishing...</Text>
          </View>
        ) : (
          <Text className="text-white font-bold text-lg">Publish Showcase</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}