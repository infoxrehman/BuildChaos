import { ActivityIndicator, FlatList, Text } from "react-native";
import PostListItem from "@/components/PostListItem";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/posts";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text className="text-red-500">{error.message}</Text>;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <PostListItem post={item} />}
    />
  );
}
