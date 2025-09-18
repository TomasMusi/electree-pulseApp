/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",        // Expo Router (app/), např. app/modal.tsx
    "./components/**/*.{js,jsx,ts,tsx}", // tvoje komponenty
    "./screens/**/*.{js,jsx,ts,tsx}",    // pokud používáš screens/
    "./*.{js,jsx,ts,tsx}",               // soubory v kořeni
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

