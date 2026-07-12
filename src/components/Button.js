import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from "react-native";
import { BlurView } from "expo-blur";
import { COLORS, RADIUS, SPACING, FONT, FONTS } from "../constants/theme";

// Komponen reusable #1: dipakai di Login, Register, Detail Produk, dll
// supaya semua tombol punya style & behaviour konsisten. Versi "liquid
// glass": tombol utama berupa bubble kaca biru bercahaya, outline berupa
// kaca transparan dengan garis tepi tipis.
export default function Button({
  title,
  onPress,
  variant = "primary", // "primary" | "outline" | "danger"
  loading = false,
  disabled = false,
  icon = null,
  style,
}) {
  const isDisabled = disabled || loading;
  const isGlassy = variant === "outline";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "danger" && styles.danger,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {isGlassy && (
        <BlurView intensity={35} tint="dark" style={[StyleSheet.absoluteFill, styles.blurLayer]} />
      )}
      {isGlassy && <View style={[StyleSheet.absoluteFill, styles.outlineOverlay]} />}
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? COLORS.text : COLORS.white} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              styles.text,
              variant === "outline" && styles.textOutline,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  primary: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  blurLayer: {
    borderRadius: RADIUS.md,
  },
  outlineOverlay: {
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.glass,
    borderWidth: 1.2,
    borderColor: COLORS.glassBorderStrong,
  },
  danger: {
    backgroundColor: COLORS.danger,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: COLORS.white,
    fontSize: FONT.body,
    fontFamily: FONTS.bodySemibold,
  },
  textOutline: {
    color: COLORS.text,
  },
});
