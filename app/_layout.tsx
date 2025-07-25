/*
 * @Date: 2025-03-22 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-31 22:55:22
 * @FilePath: /Money_Recorder/app/_layout.tsx
 */
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import { ThemeProvider } from "../contexts/ThemeContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import "./globals.css";
import { DateProvider } from "../contexts/DateContext";

export default function RootLayout() {
  return (
    <>
      <ThemeProvider>
        {({ theme }) => (
          <LanguageProvider>
            <DateProvider>
              <View
                className={`flex-1 ${
                  theme === "dark" ? "bg-quaternary" : "bg-quinary"
                }`}
                style={{ flex: 1 }}>
                <SafeAreaProvider style={{ flex: 1 }}>
                  <StatusBar style={theme === "dark" ? "light" : "dark"} />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      contentStyle: {
                        backgroundColor:
                          theme === "dark" ? "#171717" : "#FFFFFF", // 根据主题设置背景色
                      },
                      animation: "slide_from_right",
                    }}
                  />
                </SafeAreaProvider>
              </View>
            </DateProvider>
          </LanguageProvider>
        )}
      </ThemeProvider>
    </>
  );
}
