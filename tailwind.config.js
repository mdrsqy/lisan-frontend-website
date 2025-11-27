module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        serif: ["var(--font-serif)", "serif"]
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)"
      },
      boxShadow: {
        "2xs": "var(--shadow-2xs)",
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        "2xl": "var(--shadow-2xl)"
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".glass": {
          "backdrop-filter": "blur(12px)",
          "background": "rgba(255, 255, 255, 0.35)",
          "border": "1px solid rgba(255, 255, 255, 0.25)"
        },
        ".glass-sm": {
          "backdrop-filter": "blur(6px)",
          "background": "rgba(255, 255, 255, 0.25)",
          "border": "1px solid rgba(255, 255, 255, 0.2)"
        },
        ".glass-lg": {
          "backdrop-filter": "blur(20px)",
          "background": "rgba(255, 255, 255, 0.45)",
          "border": "1px solid rgba(255, 255, 255, 0.3)"
        }
      });
    }
  ]
};