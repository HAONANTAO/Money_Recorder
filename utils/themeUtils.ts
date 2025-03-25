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

  // Apply the theme class to the document body
  useEffect(() => {
    // For React Native Web, we can apply the class to the document body
    // For native, this won't have any effect but won't cause errors
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
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
