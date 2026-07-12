import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, FONT } from "../constants/theme";
import Button from "./Button";

// Komponen reusable #5 (bonus): menampilkan status pemanggilan API
// (loading / error / kosong) secara konsisten di Home & Detail Produk,
// sesuai ketentuan wajib no. 7 (Networking & API).
export default function ApiState({ status, errorMessage, onRetry, emptyText = "Tidak ada data." }) {
  if (status === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.text}>Sedang memuat data...</Text>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={40} color={COLORS.danger} />
        <Text style={[styles.text, styles.errorText]}>
          {errorMessage || "Gagal memuat data. Periksa koneksi internet Anda."}
        </Text>
        {onRetry && (
          <Button title="Coba Lagi" variant="outline" onPress={onRetry} style={{ marginTop: SPACING.md }} />
        )}
      </View>
    );
  }

  if (status === "empty") {
    return (
      <View style={styles.center}>
        <Ionicons name="search-outline" size={40} color={COLORS.textMuted} />
        <Text style={styles.text}>{emptyText}</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  text: {
    marginTop: SPACING.sm,
    fontSize: FONT.body,
    color: COLORS.textMuted,
    textAlign: "center",
    paddingHorizontal: SPACING.md,
  },
  errorText: {
    color: COLORS.danger,
  },
});
