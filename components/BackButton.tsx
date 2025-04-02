import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";

interface BackButtonProps {
  customStyle?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ customStyle = "" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className={`absolute left-4 top-10 z-20 p-1 rounded-full border
        ${isDark ? "bg-white" : "bg-black"} 
        shadow-xl shadow-black/30 ${customStyle}`}
      style={{
        elevation: 8, // 适用于 Android 端的阴影
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
