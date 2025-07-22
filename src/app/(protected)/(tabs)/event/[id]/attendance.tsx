import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FlatList, Text, View } from "react-native";

export default function EventAttendance() {
  const { id } = useLocalSearchParams();
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    fetchAttendees();
  }, [id]);

  const fetchAttendees = async () => {
    const { data } = await supabase
      .from("attendance")
      .select("*, profiles(*)")
      .eq("event_id", id);

    setAttendees(data);
  };
  return (
    <>
      <FlatList
        data={attendees}
        renderItem={({ item }) => (
          <View className="p-3">
            <Text className="text-white">
              {item.profiles.full_name || "User"}
            </Text>
          </View>
        )}
      />
    </>
  );
}
