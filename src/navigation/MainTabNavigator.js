import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import WishlistScreen from "../screens/WishlistScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import GlassTabBar from "../components/GlassTabBar";

const Tab = createBottomTabNavigator();

// Navigasi utama berbentuk tab di bawah layar, sesuai ketentuan wajib no. 6.
// Tab bar diganti dengan komponen "liquid glass" custom (GlassTabBar) yang
// melayang (floating) di atas konten, meniru gaya pada referensi screenshot.
export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <GlassTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} options={{ title: "Wishlist" }} />
      <Tab.Screen name="Pesanan" component={OrdersScreen} options={{ title: "Pesanan" }} />
      <Tab.Screen name="Profil" component={ProfileScreen} options={{ title: "Profil" }} />
    </Tab.Navigator>
  );
}
