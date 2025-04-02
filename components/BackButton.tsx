import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RelativePathString, router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";

interface BackButtonProps {
  navigateTo?: string; // 保留为 string 类型
  customStyle?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  navigateTo,
  customStyle = "",
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handlePress = () => {
    console.log("BackButton clicked"); // 添加日志
    if (navigateTo) {
      // 强制类型转换为 `RelativePathString`，确保路径类型合法
      console.log(`Navigating to: ${navigateTo}`); // 添加日志打印，帮助调试
      router.push(navigateTo as unknown as RelativePathString);
    } else {
      router.back(); // 默认返回上一页
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`absolute left-4 top-10 z-20 p-1 rounded-full border
        ${isDark ? "bg-white" : "bg-black"} 
        shadow-xl shadow-black/30 ${customStyle}`}
      style={{
        elevation: 8, // 适用于 Android 端的阴影
        backgroundColor: "rgba(255, 0, 0, 0.005)", // 为了调试点击区域是否有效
      }}>
      <Ionicons
        name="chevron-back-outline"
        size={32}
        color={isDark ? "#fff" : "#000"}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
