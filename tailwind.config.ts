import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0d0d0b",
        surface: "#151512",
        line: "rgba(242,240,232,0.12)",
        paper: "#f2f0e8",
        loop: "#d9ff63",
        signal: "#ff7a59",
        accent: "#d9ff63",
        accent2: "#ff7a59",
        muted: "#96968f",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      keyframes: {
        drift: {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(4%,-4%,0) scale(1.1)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        gate: {
          "0%,100%": { opacity: "0.72", transform: "scaleY(0.92)" },
          "50%": { opacity: "1", transform: "scaleY(1.06)" },
        },
      },
      animation: {
        drift: "drift 22s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        gate: "gate 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [typography],
};
export default config;
