import { dummyPosts } from "@/dummyData";
import { FlatList } from "react-native";
import PostListItem from "@/components/PostListItem";
import { Link } from "expo-router";

export default function Home() {
  return (
    <FlatList
      data={dummyPosts}
      renderItem={({ item }) => <PostListItem post={item} />}
      ListHeaderComponent={() => (
        <>
          <Link href="/new" className="text-blue-500 p-4 text-center text-3xl">
            New Post
          </Link>

          <Link
            href="/login"
            className="text-blue-500 p-4 text-center text-3xl"
          >
            Login
          </Link>
        </>
      )}
    />
  );
}
