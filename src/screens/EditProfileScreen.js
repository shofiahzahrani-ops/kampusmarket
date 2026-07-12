import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import InputField from "../components/InputField";
import GlassCard from "../components/GlassCard";
import GradientBackground from "../components/GradientBackground";
import { COLORS, SPACING, FONT, FONTS, RADIUS } from "../constants/theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Halaman "Edit Profil": memungkinkan pengguna mengubah nama, email,
// username, dan foto profil (diambil dari galeri perangkat).
export default function EditProfileScreen({ navigation }) {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    username: user?.username || "",
  });
  const [photo, setPhoto] = useState(user?.image || null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Nama depan wajib diisi.";
    if (!form.username.trim()) next.username = "Username wajib diisi.";
    if (!form.email.trim()) {
      next.email = "Email wajib diisi.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = "Format email tidak valid.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Izin dibutuhkan",
        "Aktifkan izin akses galeri untuk mengganti foto profil."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      await updateProfile({ ...form, image: photo });
      Alert.alert("Berhasil", "Profil berhasil diperbarui.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan profil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safe} edges={["bottom"]}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.avatarSection}>
              <Pressable onPress={handlePickPhoto} style={styles.avatarWrap}>
                <View style={styles.avatarRing}>
                  {photo ? (
                    <Image source={{ uri: photo }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                      <Ionicons name="person" size={40} color={COLORS.textMuted} />
                    </View>
                  )}
                </View>
                <View style={styles.cameraBadge}>
                  <Ionicons name="camera" size={16} color={COLORS.white} />
                </View>
              </Pressable>
              <Text style={styles.avatarHint}>Ketuk foto untuk mengganti</Text>
            </View>

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
                  placeholder="Username"
                  icon="at-outline"
                  error={errors.username}
                />

                <Button
                  title="Simpan Perubahan"
                  onPress={handleSave}
                  loading={saving}
                  style={{ marginTop: SPACING.sm }}
                />
                <Button
                  title="Batal"
                  variant="outline"
                  onPress={() => navigation.goBack()}
                  style={{ marginTop: SPACING.sm }}
                />
              </View>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scroll: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  avatarWrap: {
    position: "relative",
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    padding: 4,
    backgroundColor: "rgba(76,141,255,0.25)",
    borderWidth: 1.5,
    borderColor: COLORS.glassBorderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.glassSoft,
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  avatarHint: {
    marginTop: SPACING.sm,
    fontSize: FONT.small,
    fontFamily: FONTS.body,
    color: COLORS.textMuted,
  },
  form: {
    width: "100%",
  },
  formInner: {
    padding: SPACING.lg,
  },
});
