import { Stack } from "expo-router";

export default function EventLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dexs" options={{ title: "Dexs" }} />
      {/* <Stack.Screen name="attendance" options={{ title: "Attendance" }} />
      <Stack.Screen name="create" options={{ title: "Create" }} /> */}
    </Stack>
  );
}
