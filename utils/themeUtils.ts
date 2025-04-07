/*
 * @Date: 2025-03-25 22:32:32
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-07 13:09:03
 * @FilePath: /Money_Recorder/utils/themeUtils.ts
 */
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

/**
 * A utility hook that applies the theme class to the document body
 * This is useful for applying Tailwind's dark mode classes
 */
export const useThemeClass = () => {
  const { theme } = useTheme();
  const colorScheme = useColorScheme();

  // No need to apply theme class in React Native
  useEffect(() => {
    // Theme changes are handled by React Native's appearance API
    // and style system automatically
  }, [theme]);

  return { theme, systemTheme: colorScheme };
};

/**
 * A utility function to get the appropriate class name based on the current theme
 * @param lightClass - The class to apply in light mode
 * @param darkClass - The class to apply in dark mode
 * @returns The appropriate class based on the current theme
 */
export const getThemeClass = (
  currentTheme: string,
  lightClass: string,
  darkClass: string,
): string => {
  return currentTheme === "dark" ? darkClass : lightClass;
};
