import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/theme";

// Full-bleed aurora gradient (teal -> blue -> violet) used behind every
// screen so the "liquid glass" panels have something to float on top of.
// Two soft radial-style blobs are layered in to add depth, like light
// pooling behind frosted glass.
export default function GradientBackground({ children, style }) {
  return (
    <View style={[styles.fill, style]}>
      <LinearGradient
        colors={COLORS.gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blobTop: {
    width: 260,
    height: 260,
    top: -60,
    right: -60,
    backgroundColor: "rgba(76,141,255,0.25)",
  },
  blobBottom: {
    width: 300,
    height: 300,
    bottom: 40,
    left: -100,
    backgroundColor: "rgba(139,108,246,0.22)",
  },
});
