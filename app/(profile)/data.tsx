/*
 * @Date: 2025-03-24 17:05:36
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-24 17:05:36
 * @FilePath: /Money_Recorder/app/(profile)/data.tsx
 */
import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Data = () => {
  const { theme } = useTheme();
  return (
    <View
      className={`flex-1 justify-center items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <Text className="text-2xl font-bold text-quaternary">Data Page</Text>
      <Text className="mt-4 text-gray-600">Coming soon...</Text>
    </View>
  );
};

export default Data;
