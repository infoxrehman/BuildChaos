import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { Bitcount_400Regular, useFonts } from "@expo-google-fonts/bitcount";
import { Link } from "expo-router";

export default function Explore() {
  const [fontsLoaded] = useFonts({
    Bitcount: Bitcount_400Regular,
  });

  const imageUris = {
    community:
      "https://zexkzapypokjnrujwals.supabase.co/storage/v1/object/sign/images/explore_community_list_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzE4OWM3Zi1lNjllLTQ0NGYtYTExMy0xMTY2MTZiOWI4ZjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZXhwbG9yZV9jb21tdW5pdHlfbGlzdF9pY29uLnBuZyIsImlhdCI6MTc1MzgxNTY4NCwiZXhwIjoyMDY5MTc1Njg0fQ.BGgLWcwCg4BAX7vQjK4MxAGIpX5kUz-hrkK3ofSH_QU",
    showcase:
      "https://zexkzapypokjnrujwals.supabase.co/storage/v1/object/sign/images/explore_showcase_list_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzE4OWM3Zi1lNjllLTQ0NGYtYTExMy0xMTY2MTZiOWI4ZjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZXhwbG9yZV9zaG93Y2FzZV9saXN0X2ljb24ucG5nIiwiaWF0IjoxNzUzODE2Mjc3LCJleHAiOjIwNjkxNzYyNzd9.K1ryACF1cn09qtNY6A8lPPDzxJbBAV-2n6yYZoiN7us",
    hackathons:
      "https://zexkzapypokjnrujwals.supabase.co/storage/v1/object/sign/images/explore_hackathon_list_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzE4OWM3Zi1lNjllLTQ0NGYtYTExMy0xMTY2MTZiOWI4ZjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZXhwbG9yZV9oYWNrYXRob25fbGlzdF9pY29uLnBuZyIsImlhdCI6MTc1MzgxNjI5NywiZXhwIjoyMDY5MTc2Mjk3fQ.vr0jH-CSXrdp54t3q8Egjjo4KykGXJWmGEtQwV9C3uQ",
    techEvents:
      "https://zexkzapypokjnrujwals.supabase.co/storage/v1/object/sign/images/explore_tech_events_list_icon.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zNzE4OWM3Zi1lNjllLTQ0NGYtYTExMy0xMTY2MTZiOWI4ZjkiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvZXhwbG9yZV90ZWNoX2V2ZW50c19saXN0X2ljb24ucG5nIiwiaWF0IjoxNzUzODE2MzE3LCJleHAiOjIwNjkxNzYzMTd9.VLnuOzbHTCP3g70yubiastp2OwRauWsC6lOu5slgcvs",
  };

  return (
    <ScrollView>
      <View>
        <Link href="/src/app/(protected)/(tabs)/(explore)/community" asChild>
          <View
            className="p-10 bg-[#A5FE04] m-4 rounded-xl border-4 border-white"
            style={styles.cardContainer}
          >
            <View style={styles.textContainer}>
              <Text style={styles.menuText}>COMMUNITY</Text>
            </View>
            <Image source={{ uri: imageUris.community }} style={styles.image} />
          </View>
        </Link>

        <View
          className="p-10 bg-[#855BCB] m-4 rounded-xl border-4 border-white"
          style={styles.cardContainer}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.menuText, { color: "white" }]}>SHOWCASE</Text>
          </View>
          <Image source={{ uri: imageUris.showcase }} style={styles.image} />
        </View>

        <View
          className="p-10 bg-[#AAB3FE] m-4 rounded-xl border-4 border-white"
          style={styles.cardContainer}
        >
          <View style={styles.textContainer}>
            <Text style={styles.menuText}>HACKATHONS</Text>
          </View>
          <Image source={{ uri: imageUris.hackathons }} style={styles.image} />
        </View>

        <View
          className="p-10 bg-[#E19108] m-4 rounded-xl border-4 border-white"
          style={styles.cardContainer}
        >
          <View style={styles.textContainer}>
            <Text style={[styles.menuText, { color: "white" }]}>
              TECH EVENTS
            </Text>
          </View>
          <Image source={{ uri: imageUris.techEvents }} style={styles.image} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menuText: {
    fontSize: 28,
    fontFamily: "Bitcount",
  },
  cardContainer: {
    position: "relative",
    height: 120,
    overflow: "hidden",
  },
  textContainer: {
    position: "absolute",
    bottom: 14,
    left: 20,
  },
  image: {
    position: "absolute",
    bottom: -18,
    right: 8,
    width: 120,
    height: 120,
    resizeMode: "contain",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
