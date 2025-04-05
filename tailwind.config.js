/*
 * @Date: 2025-03-21 20:37:36
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-05 14:44:52
 * @FilePath: /Money_Recorder/tailwind.config.js
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class", // Enable dark mode with class strategy
  theme: {
    extend: {
      // customize colors
      colors: {
        // 第一个是深蓝，第二个浅蓝，第三个紫色，第四个黑色，第五个白色
        primary: "##BFDBFE", // 浅蓝色 - 主色调（Light Blue 300）
        secondary: "#93C5FD", // 更浅的蓝色 - 次色调（Light Blue 200）
        tertiary: "#E0F2FE", // 天蓝偏白 - 辅助色调（Light Blue 100）
        quaternary: "#1E3A8A", // 深蓝色 - 强调或文本色（Blue 800）
        quinary: "#F9FAFB", // 极浅灰白色背景（Gray 50）
        deepPurple: "#C084FC", // 柔和紫色，用于强调（Purple 300）
        deepBlue: "#60A5FA", // 亮一点的蓝色强调色（Blue 400）
      },
    },
  },
  plugins: [],
};
