/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // customize colors
      colors: {
        // 第一个是深蓝，第二个浅蓝，第三个紫色，第四个黑色，第五个白色
        primary: "#1E40AF",
        secondary: "#60A5FA",
        tertiary: "#7C3AED",
        quaternary: "#171717",
        quinary: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
