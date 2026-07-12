import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { COLORS, FONTS } from "../constants/theme";

// Signature visual element: KampusMarket's logo mark as a glowing glass
// bubble floating above the login/register screens, matching the
// "liquid glass" identity used across the app.
export default function LogoMark({ size = 76 }) {
  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <View style={[styles.glow, { width: size * 1.4, height: size * 1.4, borderRadius: size }]} />
      <View style={[styles.badge, { width: size, height: size, borderRadius: size * 0.32 }]}>
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={StyleSheet.absoluteFill} />
        <Text style={[styles.text, { fontSize: size * 0.34 }]}>KM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    backgroundColor: "rgba(76,141,255,0.28)",
  },
  badge: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.glassBorderStrong,
    backgroundColor: COLORS.glassStrong,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  text: {
    color: COLORS.text,
    fontFamily: FONTS.display,
  },
});
