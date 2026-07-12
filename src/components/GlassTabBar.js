import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS, RADIUS } from "../constants/theme";

const ICONS = {
  Home: "home",
  Wishlist: "heart",
  Pesanan: "receipt",
  Profil: "person",
};

// Floating "liquid glass" tab bar: a frosted pill hovering above the
// content, with the active tab shown inside a solid blue glass bubble —
// mirrors the reference screenshot's home bar.
export default function GlassTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 12 }]}>
      <View style={styles.pillShadow}>
        <BlurView intensity={55} tint="dark" style={styles.pill}>
          <View style={styles.pillOverlay} />
          <View style={styles.sheen} />
          <View style={styles.row}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const focused = state.index === index;
              const iconName = focused
                ? ICONS[route.name]
                : `${ICONS[route.name]}-outline`;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  hitSlop={8}
                  style={styles.tabTouch}
                >
                  <View style={[styles.iconBubble, focused && styles.iconBubbleActive]}>
                    <Ionicons
                      name={iconName}
                      size={22}
                      color={focused ? COLORS.white : COLORS.textMuted}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const PILL_HEIGHT = 64;

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pillShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
    borderRadius: RADIUS.full,
  },
  pill: {
    height: PILL_HEIGHT,
    paddingHorizontal: 10,
    borderRadius: RADIUS.full,
    overflow: "hidden",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  pillOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,30,50,0.35)",
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabTouch: {
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubbleActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
});
