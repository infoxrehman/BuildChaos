import {
  TextInput,
  View,
  Pressable,
  ScrollView,
  Text,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";

export default function CreateEvent() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const [selectionStep, setSelectionStep] = useState("year");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [date, setFinalDateTime] = useState("");

  // const [data,setDate] = useState(selectedYear+ selectedMonth+ selectedWeek+ selectedDay+ selectedHour+ selectedMinute+ selectTi)

  const createEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title,
          description,
          date,
          user_id: user?.id,
        },
      ])
      .select()
      .single();

    if (error) {
      Alert.alert("Failed to create the event", error.message);
    } else {
      setTitle("");
      setDescription("");
      resetSelection;
      router.push(`/event/${data.id}`);
    }

    setLoading(false);
  };

  const years = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() - 5 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ... 55
  const [weeks, setWeeks] = useState([]);
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (selectionStep !== "week") return;

    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const lastDay = new Date(selectedYear, selectedMonth, 0);
    const weeksInMonth = Math.ceil((firstDay.getDay() + lastDay.getDate()) / 7);
    setWeeks(Array.from({ length: weeksInMonth }, (_, i) => i + 1));
  }, [selectedMonth, selectionStep]);

  useEffect(() => {
    if (selectionStep !== "day") return;

    const firstDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(
      firstDayOfMonth.getDate() +
        (selectedWeek - 1) * 7 -
        firstDayOfMonth.getDay()
    );

    const daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      if (day.getMonth() + 1 === selectedMonth) {
        daysInWeek.push({
          number: day.getDate(),
          name: day.toLocaleString("default", { weekday: "short" }),
        });
      }
    }
    setDays(daysInWeek);
  }, [selectedWeek, selectionStep]);

  const handleValueChange = (value) => {
    switch (selectionStep) {
      case "year":
        setSelectedYear(value);
        setSelectionStep("month");
        break;
      case "month":
        setSelectedMonth(value);
        setSelectionStep("week");
        break;
      case "week":
        setSelectedWeek(value);
        setSelectionStep("day");
        break;
      case "day":
        setSelectedDay(value);
        setSelectionStep("hour");
        break;
      case "hour":
        setSelectedHour(value);
        setSelectionStep("minute");
        break;
      case "minute":
        setSelectedMinute(value);
        const dateTime = new Date(
          selectedYear,
          selectedMonth - 1,
          selectedDay,
          selectedHour,
          selectedMinute
        );
        const formattedDate = dateTime.toISOString().split("T")[0];
        const formattedTime = dateTime.toTimeString().substring(0, 5);
        setFinalDateTime(`${formattedDate} ${formattedTime}`);
        setSelectionStep("complete");
        break;
    }
  };

  const getPickerItems = () => {
    switch (selectionStep) {
      case "year":
        return years.map((year) => (
          <Picker.Item key={year} label={year.toString()} value={year} />
        ));
      case "month":
        return months.map((month) => (
          <Picker.Item
            key={month}
            label={new Date(selectedYear, month - 1, 1).toLocaleString(
              "default",
              { month: "long" }
            )}
            value={month}
          />
        ));
      case "week":
        return weeks.map((week) => (
          <Picker.Item key={week} label={`Week ${week}`} value={week} />
        ));
      case "day":
        return days.map((day) => (
          <Picker.Item
            key={day.number}
            label={`${day.name}, ${day.number}`}
            value={day.number}
          />
        ));
      case "hour":
        return hours.map((hour) => (
          <Picker.Item
            key={hour}
            label={hour.toString().padStart(2, "0")}
            value={hour}
          />
        ));
      case "minute":
        return minutes.map((minute) => (
          <Picker.Item
            key={minute}
            label={minute.toString().padStart(2, "0")}
            value={minute}
          />
        ));
      default:
        return [
          <Picker.Item
            key="complete"
            label="Selection complete"
            value={null}
          />,
        ];
    }
  };

  const getPickerLabel = () => {
    switch (selectionStep) {
      case "year":
        return "Select Year";
      case "month":
        return "Select Month";
      case "week":
        return "Select Week";
      case "day":
        return "Select Day";
      case "hour":
        return "Select Hour";
      case "minute":
        return "Select Minute";
      default:
        return "Date & Time Selected";
    }
  };

  const resetSelection = () => {
    setSelectionStep("year");
    setFinalDateTime("");
  };

  return (
    <View className="flex-1 bg-white rounded-t-2xl mt-8 ml-4 mr-4">
      <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
        <Ionicons
          className="mt-4"
          name="chevron-back-outline"
          size={28}
          color="black"
        />
      </Pressable>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          value={title}
          // onChangeText={(text) => setTitle(text)}
          onChangeText={setTitle}
          className="rounded-xl border border-gray-400 p-3 ml-4 mt-4 mr-4 text-black"
          placeholder="Title"
          placeholderTextColor="gray"
        />
        <TextInput
          value={description}
          onChangeText={setDescription}
          className="rounded-xl border min-h-32 border-gray-400 p-3 ml-4 mt-4 mr-4 text-black"
          placeholder="Description"
          multiline
          numberOfLines={3}
          placeholderTextColor="gray"
        />

        <View className="ml-4 mr-4 mt-4">
          <View className="mb-2">
            <Text className="text-gray-500">{getPickerLabel()}</Text>
          </View>

          <Picker
            selectedValue={
              selectionStep === "year"
                ? selectedYear
                : selectionStep === "month"
                ? selectedMonth
                : selectionStep === "week"
                ? selectedWeek
                : selectionStep === "day"
                ? selectedDay
                : selectionStep === "hour"
                ? selectedHour
                : selectionStep === "minute"
                ? selectedMinute
                : null
            }
            onValueChange={handleValueChange}
            style={{
              backgroundColor: "black",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "gray",
            }}
          >
            {getPickerItems()}
          </Picker>

          {date ? (
            <View className="mt-2 flex-row justify-between items-center">
              <Text className="text-gray-700">Selected: {date}</Text>
              <Pressable
                onPress={resetSelection}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                <Text>Change</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={() => createEvent()}
          disabled={loading}
          className="m-4 items-center rounded-xl bg-red-400 p-3 px-8"
        >
          <Text className="text-lg font-bold text-white">Create Event</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
