import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
} from "react-native";
import PostListItem from "@/components/PostListItem";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/services/posts";

export default function Home() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
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
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    />
  );
}
  // useFocusEffect(
  //   useCallback(() => {
  //     refetch();
  //   }, [refetch])
  // );