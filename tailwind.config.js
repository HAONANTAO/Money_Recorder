/*
 * @Date: 2025-03-21 20:37:36
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 22:50:06
 * @FilePath: /Money_Recorder/tailwind.config.js
 */
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
        deepPurple: "#6A0DAD",
        deepBlue: "#003366",
      },
    },
  },
  plugins: [],
};
