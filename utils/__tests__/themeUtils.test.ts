/*
 * @Date: 2025-04-07 12:59:11
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-07 13:08:07
 * @FilePath: /Money_Recorder/utils/__tests__/themeUtils.test.ts
 */
import { renderHook } from "@testing-library/react-native";
import { useThemeClass, getThemeClass } from "../themeUtils";
import { useTheme } from "../../contexts/ThemeContext";
import { useColorScheme } from "react-native";

// Mock the required hooks and modules
jest.mock("react-native", () => ({
  useColorScheme: jest.fn(),
}));

jest.mock("../../contexts/ThemeContext", () => ({
  useTheme: jest.fn(),
}));

describe("themeUtils", () => {
  describe("useThemeClass", () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });

    it("should return theme and systemTheme correctly for dark mode", () => {
      (useTheme as jest.Mock).mockReturnValue({ theme: "dark" });
      (useColorScheme as jest.Mock).mockReturnValue("dark");

      const { result } = renderHook(() => useThemeClass());

      expect(result.current.theme).toBe("dark");
      expect(result.current.systemTheme).toBe("dark");
    });

    it("should return theme and systemTheme correctly for light mode", () => {
      (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
      (useColorScheme as jest.Mock).mockReturnValue("light");

      const { result } = renderHook(() => useThemeClass());

      expect(result.current.theme).toBe("light");
      expect(result.current.systemTheme).toBe("light");
    });

    it("should handle system theme preference correctly", () => {
      (useTheme as jest.Mock).mockReturnValue({ theme: "system" });
      (useColorScheme as jest.Mock).mockReturnValue("dark");

      const { result } = renderHook(() => useThemeClass());

      expect(result.current.theme).toBe("system");
      expect(result.current.systemTheme).toBe("dark");
    });
  });

  describe("getThemeClass", () => {
    it("should return dark class when theme is dark", () => {
      const result = getThemeClass("dark", "light-class", "dark-class");
      expect(result).toBe("dark-class");
    });

    it("should return light class when theme is light", () => {
      const result = getThemeClass("light", "light-class", "dark-class");
      expect(result).toBe("light-class");
    });

    it("should return light class when theme is invalid", () => {
      const result = getThemeClass(
        "invalid-theme",
        "light-class",
        "dark-class",
      );
      expect(result).toBe("light-class");
    });
  });
});
