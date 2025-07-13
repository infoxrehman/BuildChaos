import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { View, Text, ActivityIndicator } from "react-native";
import PostListItem from "@/components/PostListItem";
import PostReplyInput from "@/components/PostReplyInput";
import { FlatList } from "react-native";
import { getPostById, getPostReplies } from "@/services/posts";
import PostDetails from "@/components/PostDetails";

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostById(id),
    staleTime: 1000 * 60 * 5,
  });

  const { data: replies } = useQuery({
    queryKey: ["posts", id, "replies"],
    queryFn: () => getPostReplies(id),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text className="text-white">{error.message}</Text>;
  }

  return (
    <View className="flex-1">
      <FlatList
        data={replies || []}
        renderItem={({ item }) => <PostListItem post={item} />}
        ListHeaderComponent={
          <>
            <PostDetails post={post} />
            <Text className="text-white text-lg font-bold p-4 border-b border-neutral-800">
              Replies
            </Text>
          </>
        }
      />

      <PostReplyInput postId={id} />
    </View>
  );
}
