import { type Config } from "tailwindcss";

const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {},
    },
  },
  darkMode: "class",
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwind-scrollbar"),
    // https://nextui.org/docs/customization/theme
    nextui({
      prefix: "nextui", // prefix for themes variables
      addCommonColors: true, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "dark", // default theme from the themes object
      defaultExtendTheme: "dark", // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {},
          colors: {},
        },
        dark: {
          layout: {
            //radius: "0.75rem",
          },
          colors: {
            primary: {},
          },
        },
        // ... custom themes
      },
    }),
  ],
} satisfies Config;
