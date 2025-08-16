import { View, Text, Pressable, Image, Alert } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Tables } from "@/types/database.types";
import { Link } from "expo-router";
import { Feather } from "@expo/vector-icons";
import SupabaseImage from "./SupabaseImage";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider"; // Assuming you have auth context

dayjs.extend(relativeTime);

type Showcase = Tables<"showcase">;

export default function ShowcaseListItem({
  project,
  isLastInGroup,
}: {
  project: Showcase;
  isLastInGroup?: boolean;
}) {
  const { user } = useAuth(); // Get current user
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const [votesCount, setVotesCount] = useState<number>(project.votes_count || 0);
  const [votersText, setVotersText] = useState<string[]>(project.voters_text || []);
  const [isVoting, setIsVoting] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Check if current user has already voted
  useEffect(() => {
    if (user && votersText.includes(user.id)) {
      setHasVoted(true);
    } else {
      setHasVoted(false);
    }
  }, [user, votersText]);

  // Handle voting functionality
  const handleVote = async (e: any) => {
    e.preventDefault(); // Prevent navigation when voting
    
    if (!user) {
      Alert.alert("Login Required", "Please login to vote for projects");
      return;
    }

    if (isVoting) return; // Prevent multiple rapid clicks
    
    setIsVoting(true);

    try {
      let newVotesCount: number;
      let newVotersText: string[];

      if (hasVoted) {
        // Remove vote
        newVotesCount = Math.max(0, votesCount - 1);
        newVotersText = votersText.filter(voterId => voterId !== user.id);
      } else {
        // Add vote
        newVotesCount = votesCount + 1;
        newVotersText = [...votersText, user.id];
      }

      // Update in Supabase
      const { error } = await supabase
        .from('showcase')
        .update({
          votes_count: newVotesCount,
          voters_text: newVotersText
        })
        .eq('id', project.id);

      if (error) {
        throw error;
      }

      // Update local state
      setVotesCount(newVotesCount);
      setVotersText(newVotersText);
      setHasVoted(!hasVoted);

    } catch (error) {
      console.error('Error updating vote:', error);
      Alert.alert("Error", "Failed to update vote. Please try again.");
    } finally {
      setIsVoting(false);
    }
  };

  // Get image URL using Supabase's getPublicUrl
  const getSupabasePublicUrl = async () => {
    if (!project.project_image) return null;

    try {
      const { data } = supabase.storage
        .from('showcase-images')
        .getPublicUrl(project.project_image);

      setImageUrl(data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return null;
    }
  };

  useEffect(() => {
    getSupabasePublicUrl();
  }, [project.project_image]);

  return (
    <Link href={`/showcase/${project.id}`} asChild>
      <Pressable className="flex-row bg-[#303030] rounded-xl p-4 mx-2 my-2 shadow-sm shadow-black/10">
        
        {/* Image Section */}
        {project.project_image && !imageError ? (
          <SupabaseImage
            bucket="showcase-images"
            path={project.project_image}
            className="w-24 h-24 rounded-xl"
            transform={undefined}
            onError={() => {
              console.log('SupabaseImage failed to load');
              setImageError(true);
            }}
          />
        ) : imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-24 h-24 rounded-xl"
            resizeMode="cover"
            onError={(error) => {
              console.log('Image failed to load:', error);
              setImageError(true);
            }}
          />
        ) : (
          <View className="w-24 h-24 rounded-xl bg-neutral-800 items-center justify-center">
            <Feather name="image" size={32} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs mt-1">No Image</Text>
          </View>
        )}

        {/* Content Section */}
        <View className="flex-1 mx-3 justify-center">
          <Text className="font-bold text-lg text-white mb-1" numberOfLines={2}>
            {project.title}
          </Text>
          <Text className="text-gray-300 text-sm mb-2" numberOfLines={3}>
            {project.description}
          </Text>
          
          {/* Creator and Date Info */}
          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-gray-400 text-xs">
              by {project.creator_name || 'Anonymous'}
            </Text>
            <Text className="text-gray-400 text-xs">
              {dayjs(project.created_at).fromNow()}
            </Text>
          </View>
        </View>

        {/* Votes Section - Now Functional */}
        <Pressable 
          onPress={handleVote}
          className="justify-center items-center"
          disabled={isVoting}
        >
          <View 
            className={`w-12 h-12 rounded-full justify-center items-center ${
              hasVoted ? 'bg-red-600' : 'bg-gray-600'
            } ${isVoting ? 'opacity-50' : ''}`}
          >
            <Feather 
              name={hasVoted ? "heart" : "heart"} 
              size={16} 
              color={hasVoted ? "white" : "#9CA3AF"}
              fill={hasVoted ? "white" : "none"}
            />
          </View>
          <Text className="text-white font-bold text-sm mt-1">
            {votesCount}
          </Text>
        </Pressable>
      </Pressable>
    </Link>
  );
}

// Simplified version with voting
export function ShowcaseListItemSimplified({
  project,
  isLastInGroup,
}: {
  project: Showcase;
  isLastInGroup?: boolean;
}) {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<number>(project.votes_count || 0);
  const [votersText, setVotersText] = useState<string[]>(project.voters_text || []);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isVoting, setIsVoting] = useState<boolean>(false);

  useEffect(() => {
    if (user && votersText.includes(user.id)) {
      setHasVoted(true);
    } else {
      setHasVoted(false);
    }
  }, [user, votersText]);

  useEffect(() => {
    if (project.project_image) {
      const { data } = supabase.storage
        .from('showcase-images')
        .getPublicUrl(project.project_image);
      setImageUrl(data.publicUrl);
    }
  }, [project.project_image]);

  const handleVote = async (e: any) => {
    e.preventDefault();
    
    if (!user || isVoting) return;
    
    setIsVoting(true);

    try {
      const newVotesCount = hasVoted ? 
        Math.max(0, votesCount - 1) : 
        votesCount + 1;
      
      const newVotersText = hasVoted ? 
        votersText.filter(id => id !== user.id) : 
        [...votersText, user.id];

      const { error } = await supabase
        .from('showcase')
        .update({
          votes_count: newVotesCount,
          voters_text: newVotersText
        })
        .eq('id', project.id);

      if (!error) {
        setVotesCount(newVotesCount);
        setVotersText(newVotersText);
        setHasVoted(!hasVoted);
      }
    } catch (error) {
      console.error('Vote error:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const getDirectImageUrl = (path: string) => {
    return `${supabase.supabaseUrl}/storage/v1/object/public/showcase-images/${path}`;
  };

  return (
    <Link href={`/showcase/${project.id}`} asChild>
      <Pressable className="flex-row bg-[#303030] rounded-xl p-4 mx-2 my-2 shadow-sm shadow-black/10">
        
        {project.project_image ? (
          <Image
            source={{ 
              uri: imageUrl || getDirectImageUrl(project.project_image) 
            }}
            className="w-24 h-24 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View className="w-24 h-24 rounded-xl bg-neutral-800 items-center justify-center">
            <Feather name="image" size={32} color="#9CA3AF" />
          </View>
        )}

        <View className="flex-1 mx-3 justify-center">
          <Text className="font-bold text-lg text-white mb-1" numberOfLines={2}>
            {project.title}
          </Text>
          <Text className="text-gray-300 text-sm mb-2" numberOfLines={3}>
            {project.description}
          </Text>
          
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-xs">
              by {project.creator_name || 'Anonymous'}
            </Text>
            <Text className="text-gray-400 text-xs">
              {dayjs(project.created_at).fromNow()}
            </Text>
          </View>
        </View>

        <Pressable 
          onPress={handleVote}
          className="justify-center items-center"
          disabled={isVoting}
        >
          <View 
            className={`w-12 h-12 rounded-full justify-center items-center ${
              hasVoted ? 'bg-red-600' : 'bg-gray-600'
            }`}
          >
            <Feather 
              name="heart" 
              size={16} 
              color={hasVoted ? "white" : "#9CA3AF"}
              fill={hasVoted ? "white" : "none"}
            />
          </View>
          <Text className="text-white font-bold text-sm mt-1">
            {votesCount}
          </Text>
        </Pressable>
      </Pressable>
    </Link>
  );
}