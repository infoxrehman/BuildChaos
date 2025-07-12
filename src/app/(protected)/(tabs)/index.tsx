import { ActivityIndicator, FlatList, Text } from "react-native";
import PostListItem from "@/components/PostListItem";
import { Link } from "expo-router";
import { useState, useEffect, use } from "react";
import { Post } from "@/types";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

const fetchPosts = async () => {
  const { data } = await supabase
    .from("posts")
    .select("*, user:profiles(*)")
    .throwOnError();

  return data;
};

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
      ListHeaderComponent={() => (
        <>
          <Link href="/new" className="text-blue-500 p-4 text-center text-3xl">
            New Post
          </Link>
        </>
      )}
    />
  );
}
