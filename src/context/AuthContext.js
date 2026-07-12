import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);
const STORAGE_KEY = "@kampusmarket_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // initializing = masih mengecek AsyncStorage saat app pertama kali dibuka
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch (e) {
        // storage rusak/tidak tersedia -> anggap saja belum login
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const login = useCallback(async (username, password) => {
    const data = await loginUser(username, password);
    const sessionUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
      token: data.accessToken || data.token,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
    setUser(sessionUser);
    return sessionUser;
  }, []);

  // Mendaftarkan akun baru (simulasi, lihat catatan di services/api.js),
  // lalu langsung mengarahkan user untuk login memakai akun demo DummyJSON.
  const register = useCallback(async (form) => {
    const data = await registerUser(form);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  // Menyimpan perubahan profil (nama, email, username, foto) secara lokal,
  // supaya halaman Profil bisa benar-benar diedit oleh pengguna.
  const updateProfile = useCallback(async (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
