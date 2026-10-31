import type { Config } from "tailwindcss";

// Tokens taken from the Figma "Design System / Foundations" frame.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#14243C",
        brand: { DEFAULT: "#245AD7", soft: "#EAF0FD" },
        canvas: "#F5F7FA",
        line: "#DEE4ED",
        ok: { DEFAULT: "#157A4A", soft: "#E6F4EC" },
        warn: { DEFAULT: "#A15C07", soft: "#FFF3D6" },
        danger: { DEFAULT: "#B3303B", soft: "#FCE9EA" },
      },
      fontFamily: { sans: ['"Inter Variable"', "Inter", "system-ui", "sans-serif"] },
      borderRadius: { card: "12px", control: "8px" },
      minHeight: { touch: "46px" },
    },
  },
  plugins: [],
};
export default config;
