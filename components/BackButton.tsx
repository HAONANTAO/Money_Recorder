/*
 * @Date: 2025-04-02 22:38:48
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-29 14:35:40
 * @FilePath: /Money_Recorder/components/BackButton.tsx
 */
import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RelativePathString, router } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";

interface BackButtonProps {
  navigateTo?: string;
  // 不需要下面的
  customStyle?: string;
  iconSize?: number;
}

const BackButton: React.FC<BackButtonProps> = ({
  navigateTo,
  customStyle = "",
  iconSize = 32,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const handlePress = () => {
    if (navigateTo) {
      console.log(`Navigating to: ${navigateTo}`);
      router.push(navigateTo as unknown as RelativePathString);
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`items-center justify-center absolute top-12 left-2 p-2 z-50 ${customStyle}`}
      style={{
        backgroundColor: "transparent",
        minWidth: 48,
        minHeight: 48,
        zIndex: 10,
      }}>
      <Ionicons
        name="chevron-back"
        size={iconSize}
        color={isDark ? "#fff" : "#0284c7"}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
