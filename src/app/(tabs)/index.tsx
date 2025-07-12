import { dummyPosts } from "@/dummyData";
import { Text } from "react-native";
import { FlatList } from "react-native";
import PostListItem from "@/components/PostListItem";

export default function Home() {
  return (
    <FlatList
      data={dummyPosts}
      renderItem={({ item }) => <PostListItem post={item} />}
    />
  );
}
