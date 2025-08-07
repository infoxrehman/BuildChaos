import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CompleteProfileScreen() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCompleteProfile = async () => {
    if (!username || !name) {
      Alert.alert('Please fill in at least username and name');
      return;
    }

    try {
      setIsLoading(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('No user found. Please sign in again.');
        router.push('/login');
        return;
      }

      // Update user profile in a profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username,
          full_name: name,
          bio,
          skills: skills.split(',').map(skill => skill.trim()),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      // Redirect to home page after successful profile completion
      router.replace('/home');
    } catch (error) {
      console.error('Profile completion error:', error);
      Alert.alert('Failed to complete profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className='flex-1 items-center justify-center bg-neutral-900 px-6'>
      <View className='w-full max-w-sm'>
        <Text className='text-3xl font-bold text-center mb-8 text-white'>
          Complete Your Profile
        </Text>

        <View className='gap-4'>
          <View>
            <Text className='text-sm font-medium text-gray-300 mb-1'>
              Username (required)
            </Text>
            <TextInput
              className='w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500'
              placeholder='Choose a username'
              placeholderTextColor='#6B7280'
              autoCapitalize='none'
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View>
            <Text className='text-sm font-medium text-gray-300 mb-1'>
              Full Name (required)
            </Text>
            <TextInput
              className='w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500'
              placeholder='Your full name'
              placeholderTextColor='#6B7280'
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className='text-sm font-medium text-gray-300 mb-1'>
              Bio
            </Text>
            <TextInput
              className='w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500'
              placeholder='Tell us about yourself'
              placeholderTextColor='#6B7280'
              multiline
              numberOfLines={3}
              value={bio}
              onChangeText={setBio}
            />
          </View>

          <View>
            <Text className='text-sm font-medium text-gray-300 mb-1'>
              Skills (comma separated)
            </Text>
            <TextInput
              className='w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500'
              placeholder='e.g. React, JavaScript, Design'
              placeholderTextColor='#6B7280'
              value={skills}
              onChangeText={setSkills}
            />
          </View>

          <TouchableOpacity
            className='w-full bg-white py-3 rounded-lg mt-6'
            activeOpacity={0.8}
            onPress={handleCompleteProfile}
            disabled={isLoading}
          >
            <Text className='text-black text-center font-semibold'>
              {isLoading ? 'Saving...' : 'Proceed'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}