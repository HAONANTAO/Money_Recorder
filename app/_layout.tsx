/*
 * @Date: 2025-03-22 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-22 21:13:55
 * @FilePath: /Money_Recorder/app/_layout.tsx
 */
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Image } from "react-native";
import "./globals.css";

export default function RootLayout() {
  return (
    <>
      <View className="flex-1">
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent", // 背景透明
              },
              animation: "slide_from_right",
            }}
          />
        </SafeAreaProvider>
      </View>
    </>
  );
}
