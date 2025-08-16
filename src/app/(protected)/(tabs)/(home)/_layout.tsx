import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Komunity",
        }}
      />
      <Stack.Screen
        name="posts/[id]"
        options={{
          title: "Komunity",
          headerBackButtonDisplayMode: "generic",
        }}
      />
    </Stack>
  );
}
