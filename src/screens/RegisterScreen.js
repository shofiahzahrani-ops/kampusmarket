import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import InputField from "../components/InputField";
import GlassCard from "../components/GlassCard";
import GradientBackground from "../components/GradientBackground";
import { COLORS, SPACING, FONT, FONTS, RADIUS } from "../constants/theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // Validasi kelengkapan data: nama, format email, panjang password
  // (persis sesuai ketentuan wajib no. 5 - Form).
  function validate() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Nama wajib diisi.";
    if (!form.username.trim()) next.username = "Username wajib diisi.";
    if (!form.email.trim()) {
      next.email = "Email wajib diisi.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = "Format email tidak valid.";
    }
    if (!form.password) {
      next.password = "Password wajib diisi.";
    } else if (form.password.length < 6) {
      next.password = "Password minimal 6 karakter.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleRegister() {
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
    } catch (err) {
      setApiError(err.message || "Pendaftaran gagal, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <GradientBackground>
        <View style={styles.successContainer}>
          <View style={styles.successStampWrapper}>
            <View style={styles.successDot1} />
            <View style={styles.successDot2} />
            <View style={styles.successDot3} />
            <View style={styles.successStamp}>
              <Ionicons name="checkmark" size={40} color={COLORS.white} />
            </View>
          </View>

          <Text style={styles.successTitle}>Pendaftaran berhasil!</Text>
          <GlassCard style={styles.successCard} radius={RADIUS.lg}>
            <Text style={styles.successText}>
              Akun Anda sudah tersimpan (simulasi via DummyJSON). Karena DummyJSON hanya
              menerima login dengan akun demo, silakan login memakai username{" "}
              <Text style={styles.hintBold}>emilys</Text> / password{" "}
              <Text style={styles.hintBold}>emilyspass</Text>.
            </Text>
          </GlassCard>
          <Button title="Ke Halaman Login" onPress={() => navigation.navigate("Login")} style={{ marginTop: SPACING.lg, width: "100%" }} />
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Daftar Akun</Text>
        <Text style={styles.subtitle}>Buat akun untuk mulai jual-beli di KampusMarket</Text>

        <GlassCard style={styles.form} radius={RADIUS.lg}>
        <View style={styles.formInner}>
          <InputField
            label="Nama Depan"
            value={form.firstName}
            onChangeText={(v) => update("firstName", v)}
            placeholder="Nama depan"
            icon="person-outline"
            error={errors.firstName}
          />
          <InputField
            label="Nama Belakang"
            value={form.lastName}
            onChangeText={(v) => update("lastName", v)}
            placeholder="Nama belakang (opsional)"
            icon="person-outline"
          />
          <InputField
            label="Email"
            value={form.email}
            onChangeText={(v) => update("email", v)}
            placeholder="nama@email.com"
            icon="mail-outline"
            keyboardType="email-address"
            error={errors.email}
          />
          <InputField
            label="Username"
            value={form.username}
            onChangeText={(v) => update("username", v)}
            placeholder="Buat username"
            icon="at-outline"
            error={errors.username}
          />
          <InputField
            label="Password"
            value={form.password}
            onChangeText={(v) => update("password", v)}
            placeholder="Minimal 6 karakter"
            icon="lock-closed-outline"
            secureTextEntry
            error={errors.password}
          />

          {apiError ? (
            <View style={styles.apiErrorBox}>
              <Text style={styles.apiError}>{apiError}</Text>
            </View>
          ) : null}

          <Button title="Daftar" onPress={handleRegister} loading={loading} style={{ marginTop: SPACING.sm }} />
          <Button
            title="Sudah punya akun? Masuk"
            variant="outline"
            onPress={() => navigation.navigate("Login")}
            style={{ marginTop: SPACING.md }}
          />
        </View>
        </GlassCard>
      </ScrollView>
    </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  title: {
    fontSize: FONT.title,
    fontFamily: FONTS.display,
    color: COLORS.text,
    marginTop: SPACING.lg,
  },
  subtitle: {
    fontSize: FONT.body,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  form: {
    width: "100%",
  },
  formInner: {
    padding: SPACING.lg,
  },
  apiErrorBox: {
    backgroundColor: "rgba(255,107,107,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.35)",
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  apiError: {
    color: COLORS.danger,
    fontSize: FONT.body,
    fontFamily: FONTS.bodyMedium,
    textAlign: "center",
  },
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
  },
  successStampWrapper: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  successStamp: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.sage,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-4deg" }],
    shadowColor: COLORS.sage,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successDot1: {
    position: "absolute",
    top: -4,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  successDot2: {
    position: "absolute",
    bottom: 2,
    left: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  successDot3: {
    position: "absolute",
    top: 10,
    left: -10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.text,
    opacity: 0.4,
  },
  successTitle: {
    fontSize: FONT.title,
    fontFamily: FONTS.display,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  successCard: {
    padding: SPACING.lg,
  },
  successText: {
    fontSize: FONT.body,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 21,
  },
  hintBold: {
    fontFamily: FONTS.bodySemibold,
    color: COLORS.text,
  },
});
