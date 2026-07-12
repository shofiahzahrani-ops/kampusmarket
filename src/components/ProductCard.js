import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, RADIUS, SPACING, FONT, GLASS_SHADOW } from "../constants/theme";
import { formatRupiah } from "../utils/currency";

// Komponen reusable #3: kartu produk kaca (glass tile), dipakai di Home
// (grid katalog) maupun di Wishlist supaya tampilan tetap konsisten.
export default function ProductCard({ product, onPress, onToggleWishlist, isWishlisted }) {
  return (
    <Pressable style={[styles.card, GLASS_SHADOW]} onPress={onPress}>
      <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />

      <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />

      {onToggleWishlist && (
        <Pressable style={styles.heartButton} onPress={onToggleWishlist} hitSlop={8}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={16}
            color={isWishlisted ? COLORS.danger : COLORS.text}
          />
        </Pressable>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>
        <View style={styles.footerRow}>
          <Text style={styles.price} numberOfLines={1}>{formatRupiah(product.price)}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={COLORS.secondary} />
            <Text style={styles.rating}>{product.rating}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: RADIUS.md,
    margin: SPACING.xs,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.glassSoft,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.glassSoft,
  },
  heartButton: {
    position: "absolute",
    top: SPACING.xs,
    right: SPACING.xs,
    borderRadius: RADIUS.full,
    padding: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  info: {
    padding: SPACING.sm,
  },
  title: {
    fontSize: FONT.body,
    fontWeight: "600",
    color: COLORS.text,
  },
  category: {
    fontSize: FONT.small,
    color: COLORS.textMuted,
    textTransform: "capitalize",
    marginTop: 2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.xs,
  },
  price: {
    flexShrink: 1,
    fontSize: FONT.body,
    fontWeight: "700",
    color: COLORS.primary,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rating: {
    fontSize: FONT.small,
    color: COLORS.textMuted,
  },
});
