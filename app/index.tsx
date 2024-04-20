import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const App = () => {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const paddingTop = top > 0 ? top + 10 : 30;

  return (
    <View style={[styles.container, { paddingTop }]}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/welcome.png")}
        style={styles.bgImage}
        resizeMode="cover"
      />
      <Animated.View entering={FadeInDown.duration(300)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "white",
            "white",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>
      <View style={styles.contentContainer}>
        <Animated.Text
          style={styles.title}
          entering={FadeInDown.delay(400).springify()}
        >
          Aura
        </Animated.Text>
        <Animated.Text
          style={styles.punchline}
          entering={FadeInDown.delay(500).springify()}
        >
          Personalize your phone with the aura it deserves.
        </Animated.Text>
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={{ alignItems: "center" }}
        >
          <Pressable
            style={styles.startButton}
            onPress={() => router.navigate("home")}
          >
            <Text style={styles.startText}>Start Exploring</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
  },
  gradient: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
    top: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 14,
  },
  title: {
    fontSize: hp(7),
    color: theme.colors.neutral(0.9),
    fontWeight: "bold",
  },
  punchline: {
    fontSize: hp(2),
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  startButton: {
    marginBottom: 50,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 15,
    paddingHorizontal: 70,
    borderRadius: theme.radius.xl,
  },
  startText: {
    color: theme.colors.white,
    fontSize: hp(3),
    fontWeight: "500",
    letterSpacing: 1,
  },
});

export default App;
