/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sky1: "#dff0fb",
        sky2: "#eaf6ff",
        cream: "#fef9f2",
        card: "#ffffff",
        ink: "#2f3a56",
        "ink-soft": "#6b7794",
        coral: "#ff8a73",
        "coral-deep": "#f4694f",
        sage: "#7fc7a4",
        lav: "#b3a2ec",
        sun: "#ffd36e",
        line: "#e7e0d5",
      },
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
        nunito: ["Nunito", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 40px -18px rgba(47,58,86,.28)",
        "soft-sm": "0 10px 24px -14px rgba(47,58,86,.30)",
      },
      borderRadius: {
        blob: "44% 56% 58% 42% / 48% 44% 56% 52%",
        "blob-2": "56% 44% 42% 58% / 54% 56% 44% 46%",
        "blob-3": "44% 40% 42% 46% / 42% 46% 40% 44%",
        xl2: "26px",
      },
      keyframes: {
        morph: {
          "0%, 100%": { borderRadius: "44% 56% 58% 42% / 48% 44% 56% 52%" },
          "50%": { borderRadius: "56% 44% 42% 58% / 54% 56% 44% 46%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        morph: "morph 12s ease-in-out infinite",
        float: "float 9s ease-in-out infinite",
        "float-rev": "float 11s ease-in-out infinite reverse",
        "float-slow": "float 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
