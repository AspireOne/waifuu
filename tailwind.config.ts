import { type Config } from "tailwindcss";

const { nextui } = require("@nextui-org/react");
const plugin = require("tailwindcss/plugin");

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
    // https://nextui.org/docs/customization/theme
    // https://nextui.org/docs/customization/colors
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
            secondary: {
              "100": "#D5F4FF",
              "200": "#ABE5FF",
              "300": "#81D1FF",
              "400": "#61BDFF",
              "500": "#2D9DFF",
              "600": "#207ADB",
              "700": "#165BB7",
              "800": "#0E4093",
              "900": "#082D7A",
              DEFAULT: "#2D9DFF",
            },
            danger: {
              "100": "#FFDADA",
              "200": "#FFB5B9",
              "300": "#FF90A1",
              "400": "#FF7598",
              "500": "#ff4788",
              "600": "#DB337F",
              "700": "#B72375",
              "800": "#931668",
              "900": "#7A0D5F",
              DEFAULT: "#ff4788",
            },
            primary: {
              "100": "#FFE5F7",
              "200": "#FFCBF3",
              "300": "#FFB1F4",
              "400": "#FF9EFA",
              "500": "#FA7EFF",
              "600": "#CB5CDB",
              "700": "#9E3FB7",
              "800": "#742893",
              "900": "#55187A",
              DEFAULT: "#FA7EFF",
            },
          },
        },
        // ... custom themes
      },
    }),
  ],
} satisfies Config;
