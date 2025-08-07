import { View, Text, Pressable, Image } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Tables } from "@/types/database.types";
import { Link } from "expo-router";

dayjs.extend(relativeTime);

type Showcase = Tables<"showcase">;

export default function ShowcaseListItem({
  project,
}: {
  project: Showcase;
  isLastInGroup?: boolean;
}) {
  return (
    <Link href={`/showcase/${project.id}`} asChild>
    <Pressable className="flex-row bg-[#303030] rounded-xl p-4 mx-2 my-2 shadow-sm shadow-black/10">
              <Image
                source={{ uri: project.project_image }}
                className="w-[96] h-[96] rounded-xl"
              />
              <View className="flex-1 m-3">
                <Text className="font-bold text-lg text-white">
                  {project.title}
                </Text>
                <Text className="text-white">{project.description}</Text>
              </View>
              <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-4">
                <Text className="font-bold">{project.votes}</Text>
              </View>
            </Pressable>
    </Link>
  );
}
