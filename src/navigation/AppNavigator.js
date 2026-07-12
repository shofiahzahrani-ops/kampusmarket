import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import MainTabNavigator from "./MainTabNavigator";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import { COLORS } from "../constants/theme";

const Stack = createNativeStackNavigator();

// Pengguna WAJIB login dulu sebelum bisa mengakses menu utama
// (ketentuan wajib no. 6). Root navigator memutuskan stack mana yang
// ditampilkan berdasarkan status "user" dari AuthContext.
export default function AppNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{
                headerShown: true,
                title: "Detail Produk",
                headerStyle: { backgroundColor: "#16233A" },
                headerTintColor: COLORS.text,
                headerTitleStyle: { color: COLORS.text },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerShown: true,
                title: "Edit Profil",
                headerStyle: { backgroundColor: "#16233A" },
                headerTintColor: COLORS.text,
                headerTitleStyle: { color: COLORS.text },
                headerShadowVisible: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
