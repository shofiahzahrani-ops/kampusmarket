import React from "react";
import { FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, RADIUS, SPACING, FONT } from "../constants/theme";

// Komponen reusable #4 (bonus): daftar chip kategori horizontal.
// Dipisah dari HomeScreen supaya bisa dipakai ulang & mudah diuji.
//
// Chip di ujung kiri/kanan bisa terlihat "kepotong" karena daftar ini
// scrollable secara horizontal (bukan tulisan yang benar-benar terpotong).
// Dua gradient tipis di kedua sisi dipasang supaya potongan itu terlihat
// sebagai isyarat "geser untuk lihat lebih banyak", bukan seperti bug.
export default function CategoryFilter({ categories, selected, onSelect }) {
  const data = ["all", ...categories];

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={data}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const active = item === selected;
          return (
            <Pressable
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(item)}
            >
              <Text
                style={[styles.chipText, active && styles.chipTextActive]}
                numberOfLines={1}
              >
                {item === "all" ? "Semua" : item}
              </Text>
            </Pressable>
          );
        }}
      />
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(13,27,46,0.85)", "rgba(13,27,46,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fade, styles.fadeLeft]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(13,27,46,0)", "rgba(13,27,46,0.85)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fade, styles.fadeRight]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  list: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  fade: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: SPACING.lg,
  },
  fadeLeft: {
    left: 0,
  },
  fadeRight: {
    right: 0,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    // paddingVertical sedikit ditambah + minHeight eksplisit supaya ada
    // ruang cukup untuk ascender/descender huruf (mis. "L" dan "p") dan
    // tidak kepotong di dalam pil.
    paddingVertical: SPACING.sm + 2,
    minHeight: 40,
    justifyContent: "center",
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.glassSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: FONT.small,
    // lineHeight eksplisit (bukan dibiarkan default) supaya Android tidak
    // memotong bagian atas/bawah huruf pada custom font di dalam kontainer
    // pendek seperti chip ini.
    lineHeight: FONT.small * 1.5,
    includeFontPadding: false,
    textAlignVertical: "center",
    color: COLORS.textMuted,
    textTransform: "capitalize",
  },
  chipTextActive: {
    color: COLORS.white,
    fontWeight: "600",
  },
});
