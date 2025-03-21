/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // customize colors
      colors: {
        primary: "#007AFF",
        secondary: "#606060",
        tertiary: "#F5F5F5",
        quaternary: "#E0E0E0",
        quinary: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
