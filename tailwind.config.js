// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(input|ripple|spinner|form).js",
    "./node_modules/@heroui/theme/dist/components/button.js",
],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};
