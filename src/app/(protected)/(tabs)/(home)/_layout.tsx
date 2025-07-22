import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Build Chaos",
        }}
      />
      <Stack.Screen
        name="posts/[id]"
        options={{
          title: "Build Chaos",
          headerBackButtonDisplayMode: "generic",
        }}
      />
    </Stack>
  );
}
