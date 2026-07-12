import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrders } from "../context/OrdersContext";
import ApiState from "../components/ApiState";
import GlassCard from "../components/GlassCard";
import GradientBackground from "../components/GradientBackground";
import { COLORS, SPACING, FONT, FONTS, RADIUS } from "../constants/theme";

// Halaman "Pesanan Saya": riwayat pembelian yang sudah dilakukan lewat
// alur "Beli Sekarang" di halaman Detail Produk.
export default function OrdersScreen() {
  const { orders, loaded } = useOrders();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pesanan Saya</Text>
          <Text style={styles.headerSubtitle}>{orders.length} pesanan</Text>
        </View>

        {!loaded ? (
          <ApiState status="loading" />
        ) : orders.length === 0 ? (
          <ApiState
            status="empty"
            emptyText="Belum ada pesanan. Tekan 'Beli Sekarang' pada halaman produk untuk membeli."
          />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <GlassCard style={styles.orderCard} radius={RADIUS.lg}>
                <View style={styles.orderInner}>
                  <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.orderMeta}>
                      {item.quantity}x Rp{item.unitPriceIdr.toLocaleString("id-ID")}
                    </Text>
                    <Text style={styles.orderDate}>
                      {new Date(item.createdAt).toLocaleString("id-ID")}
                    </Text>
                  </View>
                  <View style={styles.orderRight}>
                    <View style={styles.statusBadge}>
                      <Ionicons name="checkmark-circle" size={13} color={COLORS.success} />
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    <Text style={styles.orderTotal}>Rp{item.totalIdr.toLocaleString("id-ID")}</Text>
                  </View>
                </View>
              </GlassCard>
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
    padding: SPACING.md,
    paddingBottom: 140,
    gap: SPACING.sm,
  },
  orderCard: {
    marginBottom: SPACING.sm,
  },
  orderInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.glassSoft,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: FONT.body,
    fontFamily: FONTS.bodySemibold,
    color: COLORS.text,
  },
  orderMeta: {
    fontSize: FONT.small,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  orderDate: {
    fontSize: 11,
    fontFamily: FONTS.body,
    color: COLORS.textFaint,
    marginTop: 2,
  },
  orderRight: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(78,208,160,0.15)",
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.success,
  },
  orderTotal: {
    fontSize: FONT.body,
    fontFamily: FONTS.bodySemibold,
    color: COLORS.primary,
  },
});
