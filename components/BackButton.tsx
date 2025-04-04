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
  iconSize = 28,
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
      className={`items-center justify-center px-2 py-2 absolute top-0 left-0 ${customStyle}`}
      style={{
        backgroundColor: "transparent",
        minWidth: 44,
        minHeight: 44,
        zIndex: 10,
      }}>
      <Ionicons
        name="chevron-back"
        size={iconSize}
        color={isDark ? "#fff" : "#007AFF"}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
