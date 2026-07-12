import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, Image, StyleSheet, Alert, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductById } from "../services/api";
import ApiState from "../components/ApiState";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";
import GradientBackground from "../components/GradientBackground";
import BuyNowModal from "../components/BuyNowModal";
import { useWishlist } from "../context/WishlistContext";
import { useOrders } from "../context/OrdersContext";
import { COLORS, SPACING, FONT, FONTS, RADIUS } from "../constants/theme";
import { formatRupiah } from "../utils/currency";

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const { width } = useWindowDimensions();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { checkout } = useOrders();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [buying, setBuying] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getProductById(productId);
      setProduct(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err.message);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleConfirmPurchase(quantity) {
    setBuying(true);
    try {
      const order = await checkout({ product, quantity });
      setBuyModalVisible(false);
      Alert.alert(
        "Pembelian Berhasil \ud83c\udf89",
        `${quantity}x ${product.title} berhasil dibeli.\nTotal: Rp${order.totalIdr.toLocaleString("id-ID")}\n\nLihat status pesanan di tab Pesanan.`,
        [
          { text: "Lihat Pesanan", onPress: () => navigation.navigate("MainTabs", { screen: "Pesanan" }) },
          { text: "Tutup", style: "cancel" },
        ]
      );
    } catch (err) {
      Alert.alert("Gagal", "Terjadi kesalahan saat memproses pembelian. Coba lagi.");
    } finally {
      setBuying(false);
    }
  }

  if (status !== "success") {
    return (
      <GradientBackground>
        <SafeAreaView style={styles.safe}>
          <ApiState status={status} errorMessage={errorMessage} onRetry={load} />
        </SafeAreaView>
      </GradientBackground>
    );
  }

  const wishlisted = isInWishlist(product.id);

  return (
    <GradientBackground>
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.thumbnail }} style={[styles.image, { height: width * 0.8 }]} />
        </View>

        <GlassCard style={styles.bodyCard} radius={RADIUS.xl}>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.title}</Text>
            <Button
              title=""
              variant="outline"
              icon={
                <Ionicons
                  name={wishlisted ? "heart" : "heart-outline"}
                  size={20}
                  color={wishlisted ? COLORS.danger : COLORS.primary}
                />
              }
              onPress={() => toggleWishlist(product)}
              style={styles.heartBtn}
            />
          </View>

          <Text style={styles.category}>{product.category}</Text>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={COLORS.secondary} />
            <Text style={styles.rating}>{product.rating} \u00b7 Stok: {product.stock}</Text>
          </View>

          <Text style={styles.price}>{formatRupiah(product.price)}</Text>

          <Text style={styles.sectionTitle}>Deskripsi</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.actionRow}>
            <Button
              title={wishlisted ? "Hapus Wishlist" : "Wishlist"}
              variant="outline"
              onPress={() => toggleWishlist(product)}
              style={styles.actionBtn}
            />
            <Button
              title="Beli Sekarang"
              variant="primary"
              onPress={() => setBuyModalVisible(true)}
              style={styles.actionBtn}
            />
          </View>
        </View>
        </GlassCard>
      </ScrollView>

      <BuyNowModal
        visible={buyModalVisible}
        product={product}
        loading={buying}
        onClose={() => setBuyModalVisible(false)}
        onConfirm={handleConfirmPurchase}
      />
    </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    paddingBottom: SPACING.xl,
  },
  imageWrap: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  image: {
    width: "100%",
    backgroundColor: COLORS.glassSoft,
    borderRadius: RADIUS.lg,
  },
  bodyCard: {
    margin: SPACING.md,
  },
  body: {
    padding: SPACING.lg,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: SPACING.sm,
  },
  title: {
    flex: 1,
    fontSize: FONT.title,
    fontFamily: FONTS.display,
    color: COLORS.text,
  },
  heartBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  category: {
    fontSize: FONT.body,
    color: COLORS.textMuted,
    textTransform: "capitalize",
    marginTop: SPACING.xs,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  rating: {
    fontSize: FONT.body,
    color: COLORS.textMuted,
  },
  price: {
    fontSize: 26,
    fontFamily: FONTS.display,
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT.subtitle,
    fontFamily: FONTS.displaySemibold,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT.body,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  actionBtn: {
    flex: 1,
  },
});
