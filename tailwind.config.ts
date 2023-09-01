import { type Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");

export default {
  content: [
    './index.html',
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#F9F9F9",
          100: "#F2F2F2",
          200: "#E6E6E6",
          300: "#EFEDE6",
          400: "#D1CBB3",
          500: "#B3B28B",
          600: "#948A63",
          700: "#75663B",
          800: "#564214",
          900: "#372E00",
        }
      }
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/typography"), nextui()],
} satisfies Config;
