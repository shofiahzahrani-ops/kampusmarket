import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, FlatList, StyleSheet, useWindowDimensions } from "react-native";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import ApiState from "../components/ApiState";
import GradientBackground from "../components/GradientBackground";
import { COLORS, SPACING, FONT, FONTS } from "../constants/theme";

export default function WishlistScreen({ navigation }) {
  const { items, toggleWishlist, isInWishlist } = useWishlist();
  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wishlist Saya</Text>
          <Text style={styles.headerSubtitle}>{items.length} produk disimpan</Text>
        </View>

        {items.length === 0 ? (
          <ApiState status="empty" emptyText="Belum ada produk di wishlist. Tap ikon hati pada produk untuk menyimpannya." />
        ) : (
          <FlatList
            data={items}
            key={numColumns}
            keyExtractor={(item) => String(item.id)}
            numColumns={numColumns}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate("ProductDetail", { productId: item.id })}
                onToggleWishlist={() => toggleWishlist(item)}
                isWishlisted={isInWishlist(item.id)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    padding: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT.title,
    fontFamily: FONTS.display,
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT.body,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  listContent: {
    padding: SPACING.xs,
    paddingBottom: 140,
  },
});
