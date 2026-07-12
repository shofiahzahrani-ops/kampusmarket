import React from "react";
import { StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { COLORS, RADIUS, GLASS_SHADOW } from "../constants/theme";

// Core "liquid glass" building block: a blurred, translucent panel with a
// soft top sheen and a hairline border, used everywhere a card/sheet would
// normally appear (product cards, forms, profile panels, tab bar...).
export default function GlassCard({
  children,
  style,
  intensity = 40,
  tint = "dark",
  radius = RADIUS.lg,
  strong = false,
  noShadow = false,
}) {
  return (
    <View
      style={[
        styles.wrapper,
        { borderRadius: radius },
        !noShadow && GLASS_SHADOW,
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={tint}
        style={[StyleSheet.absoluteFill, { borderRadius: radius }]}
      />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: radius,
            backgroundColor: strong ? COLORS.glassStrong : COLORS.glass,
            borderWidth: 1,
            borderColor: COLORS.glassBorder,
          },
        ]}
      />
      <View style={[styles.sheen, { borderRadius: radius }]} />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  inner: {
    width: "100%",
  },
});
