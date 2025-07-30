import { Stack } from "expo-router";

export default function EventLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="explore" options={{ title: "Explore" }} />
      <Stack.Screen name="community" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="showcase" options={{ title: "Edit Profile" }} />
      <Stack.Screen name="hackhathons" options={{ title: "Edit Profile" }} />
    </Stack>
  );
}
