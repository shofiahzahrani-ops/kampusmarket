// Design tokens for KampusMarket's "Liquid Glass" visual identity —
// a frosted, translucent glass UI floating over a soft aurora gradient
// (teal → indigo → violet), inspired by modern glassmorphism systems.
// Used across the whole app so every screen stays visually consistent.

export const COLORS = {
  // Core accents
  primary: "#4C8DFF", // liquid-glass blue, used for CTAs & active states
  primaryDark: "#2F6FE0",
  secondary: "#F4B942", // amber, used for ratings/badges
  sage: "#4ED0A0", // mint, used for success/wishlist accents
  accentPurple: "#8B6CF6",

  // Aurora gradient background (teal -> blue -> violet)
  gradient: ["#0F3D3E", "#193A66", "#3B2A6B"],
  gradientReverse: ["#3B2A6B", "#193A66", "#0F3D3E"],

  // Base surfaces
  background: "#0D1B2E", // deep space behind the gradient (fallback)
  surface: "#16233A", // solid fallback card (rarely used, glass preferred)

  // Glass surfaces (frosted panels over the gradient)
  glass: "rgba(255,255,255,0.10)",
  glassStrong: "rgba(255,255,255,0.16)",
  glassSoft: "rgba(255,255,255,0.06)",
  glassBorder: "rgba(255,255,255,0.22)",
  glassBorderStrong: "rgba(255,255,255,0.35)",
  glassHighlight: "rgba(255,255,255,0.45)", // top-edge sheen line

  // Text (light, for dark glassy backgrounds)
  text: "#F5F7FC",
  textMuted: "rgba(235,240,255,0.65)",
  textFaint: "rgba(235,240,255,0.42)",

  border: "rgba(255,255,255,0.14)",
  danger: "#FF6B6B",
  success: "#4ED0A0",
  white: "#FFFFFF",
  black: "#000000",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 30,
  full: 999,
};

export const FONT = {
  title: 24,
  subtitle: 17,
  body: 14,
  small: 12,
};

// Font family roles. Loaded via expo-font/@expo-google-fonts in App.js.
// Poppins = display (headlines, logo mark) · Inter = body/UI text.
export const FONTS = {
  display: "Poppins_700Bold",
  displaySemibold: "Poppins_600SemiBold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
};

// Shared shadow used under glass panels to lift them off the gradient.
export const GLASS_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.25,
  shadowRadius: 16,
  elevation: 6,
};
