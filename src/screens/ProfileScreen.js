import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useOrders } from "../context/OrdersContext";
import Button from "../components/Button";
import GlassCard from "../components/GlassCard";
import GradientBackground from "../components/GradientBackground";
import { COLORS, SPACING, FONT, FONTS, RADIUS } from "../constants/theme";

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { items } = useWishlist();
  const { orders } = useOrders();

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>Profil</Text>

          <GlassCard style={styles.headerCard} radius={RADIUS.xl}>
            <View style={styles.headerInner}>
              <View style={styles.avatarRing}>
                {user?.image ? (
                  <Image source={{ uri: user.image }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Ionicons name="person" size={36} color={COLORS.textMuted} />
                  </View>
                )}
              </View>
              <Text style={styles.name}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.username}>@{user?.username}</Text>

              <Button
                title="Edit Profil"
                variant="outline"
                icon={<Ionicons name="create-outline" size={16} color={COLORS.text} />}
                onPress={() => navigation.navigate("EditProfile")}
                style={styles.editBtn}
              />
            </View>
          </GlassCard>

          <View style={styles.statsRow}>
            <GlassCard style={styles.statCard} radius={RADIUS.lg}>
              <View style={styles.statInner}>
                <Ionicons name="heart" size={20} color={COLORS.danger} />
                <Text style={styles.statValue}>{items.length}</Text>
                <Text style={styles.statLabel}>Wishlist</Text>
              </View>
            </GlassCard>
            <GlassCard style={styles.statCard} radius={RADIUS.lg}>
              <View style={styles.statInner}>
                <Ionicons name="receipt" size={20} color={COLORS.secondary} />
                <Text style={styles.statValue}>{orders.length}</Text>
                <Text style={styles.statLabel}>Pesanan</Text>
              </View>
            </GlassCard>
          </View>

          <GlassCard style={styles.infoCard} radius={RADIUS.lg}>
            <View style={styles.infoInner}>
              <Row icon="mail-outline" label="Email" value={user?.email} />
              <View style={styles.divider} />
              <Row icon="person-outline" label="Username" value={user?.username} />
            </View>
          </GlassCard>

          <Button title="Keluar" variant="danger" onPress={logout} style={styles.logoutBtn} />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

function Row({ icon, label, value }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIconWrap}>
        <Ionicons name={icon} size={17} color={COLORS.text} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: 140,
  },
  pageTitle: {
    fontSize: FONT.title,
    fontFamily: FONTS.display,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  headerCard: {
    marginBottom: SPACING.md,
  },
  headerInner: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 4,
    backgroundColor: "rgba(76,141,255,0.25)",
    borderWidth: 1.5,
    borderColor: COLORS.glassBorderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.glassSoft,
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: FONT.title,
    fontFamily: FONTS.display,
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  username: {
    fontSize: FONT.body,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  editBtn: {
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
  },
  statInner: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
    gap: 4,
  },
  statValue: {
    fontSize: FONT.subtitle,
    fontFamily: FONTS.displaySemibold,
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT.small,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
  },
  infoCard: {
    marginBottom: SPACING.xl,
  },
  infoInner: {
    padding: SPACING.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingVertical: SPACING.sm,
  },
  rowIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.glassSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: FONT.body,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    width: 80,
  },
  rowValue: {
    flex: 1,
    fontSize: FONT.body,
    fontFamily: FONTS.bodySemibold,
    color: COLORS.text,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 2,
  },
  logoutBtn: {
    marginTop: SPACING.sm,
  },
});
