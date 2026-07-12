import React, { useState, useEffect } from "react";
import { Modal, View, Text, StyleSheet, Pressable } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import GlassCard from "./GlassCard";
import Button from "./Button";
import { COLORS, SPACING, FONT, FONTS, RADIUS } from "../constants/theme";
import { formatRupiah, toRupiahAmount } from "../utils/currency";

// Modal konfirmasi pembelian: pilih jumlah barang, lihat ringkasan harga
// dalam Rupiah, lalu konfirmasi untuk membuat pesanan (bukan sekadar
// menambah ke wishlist).
export default function BuyNowModal({ visible, product, loading, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (visible) setQuantity(1);
  }, [visible]);

  if (!product) return null;

  const unitPrice = toRupiahAmount(product.price);
  const total = unitPrice * quantity;
  const maxQty = Math.max(1, Math.min(product.stock || 10, 10));

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <GlassCard style={styles.card} radius={RADIUS.xl} strong>
          <View style={styles.inner}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Beli Sekarang</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Ionicons name="close-circle" size={26} color={COLORS.textMuted} />
              </Pressable>
            </View>

            <Text style={styles.productTitle} numberOfLines={2}>
              {product.title}
            </Text>
            <Text style={styles.unitPrice}>{formatRupiah(product.price)} / item</Text>

            <View style={styles.qtyRow}>
              <Text style={styles.qtyLabel}>Jumlah</Text>
              <View style={styles.stepper}>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  hitSlop={8}
                >
                  <Ionicons name="remove" size={18} color={COLORS.text} />
                </Pressable>
                <Text style={styles.qtyValue}>{quantity}</Text>
                <Pressable
                  style={styles.stepBtn}
                  onPress={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  hitSlop={8}
                >
                  <Ionicons name="add" size={18} color={COLORS.text} />
                </Pressable>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Bayar</Text>
              <Text style={styles.totalValue}>Rp{total.toLocaleString("id-ID")}</Text>
            </View>

            <Button
              title="Konfirmasi Pembelian"
              onPress={() => onConfirm(quantity)}
              loading={loading}
              style={{ marginTop: SPACING.md }}
            />
            <Text style={styles.note}>
              Pesanan ini simulasi (tanpa proses pembayaran nyata) untuk keperluan demo aplikasi.
            </Text>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(5,10,20,0.55)",
    justifyContent: "flex-end",
  },
  card: {
    margin: SPACING.md,
    marginBottom: SPACING.xl,
  },
  inner: {
    padding: SPACING.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: FONT.subtitle,
    fontFamily: FONTS.display,
    color: COLORS.text,
  },
  productTitle: {
    fontSize: FONT.body,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  unitPrice: {
    fontSize: FONT.small,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
  },
  qtyLabel: {
    fontSize: FONT.body,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.text,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.glassSoft,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.glass,
  },
  qtyValue: {
    fontSize: FONT.subtitle,
    fontFamily: FONTS.bodySemibold,
    color: COLORS.text,
    minWidth: 20,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.lg,
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT.body,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
  },
  totalValue: {
    fontSize: FONT.title,
    fontFamily: FONTS.display,
    color: COLORS.primary,
  },
  note: {
    fontSize: 11,
    fontFamily: FONTS.body,
    color: COLORS.textFaint,
    textAlign: "center",
    marginTop: SPACING.md,
  },
});
