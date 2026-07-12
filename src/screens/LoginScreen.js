import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import InputField from "../components/InputField";
import LogoMark from "../components/LogoMark";
import GlassCard from "../components/GlassCard";
import GradientBackground from "../components/GradientBackground";
import { COLORS, SPACING, FONT, FONTS, RADIUS } from "../constants/theme";

const FEATURES = [
  { icon: "shield-checkmark-outline", label: "Aman" },
  { icon: "flash-outline", label: "Cepat" },
  { icon: "school-outline", label: "Untuk Mahasiswa" },
];

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Animasi fade + slide + logo memantul lembut saat layar pertama kali
  // tampil, supaya halaman login terasa lebih hidup & menarik.
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim, logoScale]);

  // Validasi form sebelum dikirim (ketentuan wajib no. 5 - Form)
  function validate() {
    const next = {};
    if (!username.trim()) next.username = "Username wajib diisi.";
    if (!password) {
      next.password = "Password wajib diisi.";
    } else if (password.length < 6) {
      next.password = "Password minimal 6 karakter.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleLogin() {
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await login(username.trim(), password);
      // Navigasi ditangani otomatis oleh RootNavigator saat "user" berubah.
    } catch (err) {
      setApiError(err.message || "Username atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GradientBackground>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: logoScale }] }}>
            <LogoMark size={88} />
          </Animated.View>
          <Text style={styles.title}>KampusMarket</Text>
          <Text style={styles.subtitle}>
            Papan jual-beli barang bekas mahasiswa, cepat, aman, dan hemat di kantong.
          </Text>

          <View style={styles.featureRow}>
            {FEATURES.map((f) => (
              <View key={f.label} style={styles.featureChip}>
                <Ionicons name={f.icon} size={14} color={COLORS.primary} />
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          style={[{ width: "100%", opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <GlassCard style={styles.form} radius={RADIUS.lg} strong>
          <View style={styles.formInner}>
            <Text style={styles.formTitle}>Masuk ke Akunmu</Text>

            <InputField
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="cth: emilys"
              icon="person-outline"
              error={errors.username}
            />
            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Masukkan password"
              icon="lock-closed-outline"
              secureTextEntry
              error={errors.password}
            />

            {apiError ? (
              <View style={styles.apiErrorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={COLORS.danger} />
                <Text style={styles.apiError}>{apiError}</Text>
              </View>
            ) : null}

            <Button
              title="Masuk"
              onPress={handleLogin}
              loading={loading}
              icon={<Ionicons name="log-in-outline" size={18} color={COLORS.white} />}
              style={{ marginTop: SPACING.sm }}
            />

            <View style={styles.hintBox}>
              <Ionicons name="information-circle-outline" size={14} color={COLORS.textFaint} />
              <Text style={styles.hint}>
                Akun demo:{" "}
                <Text style={styles.hintBold}>emilys</Text> /{" "}
                <Text style={styles.hintBold}>emilyspass</Text>
              </Text>
            </View>

            <Button
              title="Belum punya akun? Daftar"
              variant="outline"
              onPress={() => navigation.navigate("Register")}
              style={{ marginTop: SPACING.md }}
            />
          </View>
          </GlassCard>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: FONTS.display,
    color: COLORS.text,
    marginTop: SPACING.lg,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT.body,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
    textAlign: "center",
    paddingHorizontal: SPACING.md,
    lineHeight: 20,
  },
  featureRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginTop: SPACING.lg,
  },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.glassSoft,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
  },
  featureText: {
    fontSize: 11,
    fontFamily: FONTS.bodyMedium,
    color: COLORS.text,
  },
  form: {
    width: "100%",
  },
  formInner: {
    padding: SPACING.lg,
  },
  formTitle: {
    fontSize: FONT.subtitle,
    fontFamily: FONTS.displaySemibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  apiErrorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,107,107,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.35)",
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  apiError: {
    flex: 1,
    color: COLORS.danger,
    fontSize: FONT.small,
    fontFamily: FONTS.bodyMedium,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    justifyContent: "center",
  },
  hint: {
    fontSize: FONT.small,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  hintBold: {
    fontFamily: FONTS.bodySemibold,
    color: COLORS.text,
  },
});
