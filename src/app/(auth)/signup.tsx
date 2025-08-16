import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  } from "react-native";
  import { Link } from "expo-router";
  import { useState } from "react";
  import { supabase } from "@/lib/supabase";
  import { Picker } from "@react-native-picker/picker";
  
  const techSkills = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "PHP",
  "Ruby",
  "Go",
  "Rust",
  "Swift",
  "Kotlin",
  "Dart",
  "React",
  "React Native",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express",
  "Django",
  "Flask",
  "Spring",
  "Laravel",
  "Ruby on Rails",
  ".NET",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Firebase",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "GraphQL",
  "REST API",
  "HTML",
  "CSS",
  "SASS/SCSS",
  "Tailwind CSS",
  "Bootstrap",
  ];
  
  export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  
  const checkUsernameAvailability = async (username: string) => {
  if (!username) {
  setUsernameAvailable(true);
  return;
  }
  
  try {
  const { data, error } = await supabase
  .from('profiles')
  .select('username')
  .eq('username', username.toLowerCase());
  
  if (error) throw error;
  
  setUsernameAvailable(data.length === 0);
  } catch (error) {
  console.error("Error checking username:", error);
  Alert.alert("Error", "Could not check username availability");
  }
  };
  
  const handleUsernameChange = (text: string) => {
  setUsername(text);
  checkUsernameAvailability(text);
  };
  
  const toggleSkill = (skill: string) => {
  setSelectedSkills(prev =>
  prev.includes(skill)
  ? prev.filter(s => s !== skill)
  : [...prev, skill]
  );
  };

  // Function to create profile in the profiles table
  const createProfile = async (userId: string) => {
    try {
      const profileData = {
        id: userId,
        name: name.trim(),
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        bio: bio.trim() || null,
        skills: selectedSkills.length > 0 ? selectedSkills : null,
        updated_at: new Date().toISOString(),
      };

      // Using upsert to handle any conflicts
      const { data, error } = await supabase
        .from('profiles')
        .upsert([profileData], { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select();

      if (error) {
        console.error('Profile creation error:', error);
        throw error;
      }

      console.log('Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createProfile:', error);
      throw error;
    }
  };

  // Alternative method if upsert fails
  const createProfileAlternative = async (userId: string) => {
    try {
      // First check if profile exists
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      const profileData = {
        id: userId,
        name: name.trim(),
        username: username.toLowerCase().trim(),
        email: email.toLowerCase().trim(),
        bio: bio.trim() || null,
        skills: selectedSkills.length > 0 ? selectedSkills : null,
        updated_at: new Date().toISOString(),
      };

      if (existingProfile) {
        // Update existing profile
        const { data, error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', userId)
          .select();

        if (error) throw error;
        return data;
      } else {
        // Create new profile
        
        const { data, error } = await supabase
          .from('profiles')
          .upsert([profileData])
          .select();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Alternative profile creation error:', error);
      throw error;
    }
  };
  
  const handleSignUp = async () => {
    if (!email || !password || !name || !username) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }
  
    if (!usernameAvailable) {
      Alert.alert("Error", "Username already taken");
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Step 1: Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email: email.toLowerCase().trim(), 
        password: password,
      });
  
      if (authError) {
        Alert.alert("Authentication Error", authError.message);
        return;
      }

      if (!authData.user) {
        Alert.alert("Error", "User creation failed");
        return;
      }

      // Step 2: Create profile in profiles table
      try {
        await createProfile(authData.user.id);
        
        Alert.alert(
          "Success", 
          "Account created successfully! Please check your email to verify your account.",
          [
            { 
              text: 'OK', 
              onPress: () => {
                // Clear form
                setEmail("");
                setPassword("");
                setName("");
                setBio("");
                setUsername("");
                setSelectedSkills([]);
              }
            }
          ]
        );

      } catch (profileError) {
        console.log('Primary profile creation failed, trying alternative method...');
        
        try {
          await createProfileAlternative(authData.user.id);
          
          Alert.alert(
            "Success", 
            "Account created successfully! Please check your email to verify your account.",
            [
              { 
                text: 'OK', 
                onPress: () => {
                  // Clear form
                  setEmail("");
                  setPassword("");
                  setName("");
                  setBio("");
                  setUsername("");
                  setSelectedSkills([]);
                }
              }
            ]
          );

        } catch (alternativeError) {
          console.error('Both profile creation methods failed:', alternativeError);
          Alert.alert(
            "Warning", 
            "Account was created but profile setup failed. You can update your profile later."
          );
        }
      }

    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert("Error", "Could not create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
  <ScrollView>
  <View className="flex-1 items-center justify-center px-6">
  <View className="w-full max-w-sm">
  <Text className="text-3xl font-bold text-center mb-8 text-white">
  Create an account
  </Text>
  
  <View className="gap-4">
  <View>
  <Text className="text-sm font-medium text-gray-300 mb-1">
  Name *
  </Text>
  <TextInput
  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500"
  placeholder="Enter your name"
  placeholderTextColor="#6B7280"
  value={name}
  onChangeText={setName}
  />
  </View>
  
  <View className="mt-4">
  <Text className="text-sm font-medium text-gray-300 mb-1">
  Username *
  </Text>
  <TextInput
  className={`w-full px-4 py-3 bg-neutral-800 border ${usernameAvailable ? 'border-neutral-700' : 'border-red-500'} rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500`}
  placeholder="Enter your username"
  placeholderTextColor="#6B7280"
  value={username}
  onChangeText={handleUsernameChange}
  autoCapitalize="none"
  />
  {!usernameAvailable && (
  <Text className="text-red-500 text-xs mt-1">
  Username already taken
  </Text>
  )}
  </View>
  
  <View className="mt-4">
  <Text className="text-sm font-medium text-gray-300 mb-1">
  Bio
  </Text>
  <TextInput
  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500"
  placeholder="Enter a bio"
  placeholderTextColor="#6B7280"
  value={bio}
  onChangeText={setBio}
  multiline
  numberOfLines={3}
  />
  </View>
  
  <View className="mt-4">
  <Text className="text-sm font-medium text-gray-300 mb-1">
  Skills
  </Text>
  <View style={styles.pickerContainer}>
  <Picker
  selectedValue={""}
  onValueChange={(itemValue) =>
  itemValue && toggleSkill(itemValue)
  }
  style={styles.picker}
  dropdownIconColor="#ffffff"
  >
  <Picker.Item label="Select skills..." value="" />
  {techSkills.map(skill => (
  <Picker.Item
  key={skill}
  label={skill}
  value={skill}
  color={selectedSkills.includes(skill) ? '#3b82f6' : '#ffffff'}
  />
  ))}
  </Picker>
  </View>
  <View style={styles.skillsContainer}>
  {selectedSkills.map(skill => (
  <View key={skill} style={styles.skillTag}>
  <Text style={styles.skillText}>{skill}</Text>
  <TouchableOpacity
  onPress={() => toggleSkill(skill)}
  style={styles.removeSkill}
  >
  <Text style={styles.removeSkillText}>×</Text>
  </TouchableOpacity>
  </View>
  ))}
  </View>
  </View>
  
  <View className="mt-4">
  <Text className="text-sm font-medium text-gray-300 mb-1">
  Email *
  </Text>
  <TextInput
  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500"
  placeholder="Enter your email"
  placeholderTextColor="#6B7280"
  keyboardType="email-address"
  autoCapitalize="none"
  value={email}
  onChangeText={setEmail}
  />
  </View>
  
  <View className="mt-4">
  <Text className="text-sm font-medium text-gray-300 mb-1">
  Password *
  </Text>
  <TextInput
  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500"
  placeholder="Enter your password (min 6 characters)"
  placeholderTextColor="#6B7280"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
  />
  </View>
  
  <TouchableOpacity
  className={`w-full py-3 rounded-lg mt-6 ${isLoading ? 'bg-gray-600' : 'bg-white'}`}
  activeOpacity={0.8}
  onPress={handleSignUp}
  disabled={isLoading}
  >
  <Text className="text-black text-center font-semibold">
  {isLoading ? "Creating account..." : "Sign up"}
  </Text>
  </TouchableOpacity>
  
  <View className="flex-row justify-center mt-4">
  <Text className="text-gray-400">Already have an account? </Text>
  <Link href="/login" asChild>
  <Pressable>
  <Text className="text-blue-400 font-medium">Sign in</Text>
  </Pressable>
  </Link>
  </View>
  </View>
  </View>
  </View></ScrollView>
  );
  }
  
  const styles = StyleSheet.create({
  pickerContainer: {
  backgroundColor: '#262626',
  borderRadius: 8,
  borderWidth: 1,
  height:200,
  borderColor: '#404040',
  overflow: 'hidden',
  },
  picker: {
  color: 'white',
  height: 50,
  },
  skillsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 8,
  gap: 8,
  },
  skillTag: {
  flexDirection: 'row',
  backgroundColor: '#3b82f6',
  borderRadius: 16,
  paddingVertical: 4,
  paddingHorizontal: 12,
  alignItems: 'center',
  },
  skillText: {
  color: 'white',
  fontSize: 14,
  },
  removeSkill: {
  marginLeft: 6,
  },
  removeSkillText: {
  color: 'white',
  fontWeight: 'bold',
  },
  });