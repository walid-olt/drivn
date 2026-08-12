import { pixelBasedPreset, type TailwindConfig } from "react-email"

// Tailwind config for email templates
// Hard-coded design tokens (no CSS variables) because react-email's Tailwind
// implementation doesn't support runtime variables. Copied/flattened from app styles.
const config: TailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        // Brand
        brand: "#1a73e8",
        "brand-50": "#e8f0fe",
        "brand-100": "#d2e3fc",
        "brand-600": "#1765d6",
        // Neutral
        bg: "#ffffff",
        surface: "#f8fafc",
        muted: "#6b7280",
        text: "#111827",
        // Status
        success: "#16a34a",
        danger: "#dc2626",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
      },
      spacing: {
        "1.5": "6px",
        "2.5": "10px",
        "4.5": "18px",
      },
    },
  },
}

export default config
