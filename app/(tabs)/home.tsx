/*
 * @Date: 2025-03-21 21:26:12
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 16:05:53
 * @FilePath: /Money_Recorder/app/(tabs)/home.tsx
 */
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const Home = () => {
  const { theme } = useTheme();
  return (
    <View
      className={`flex-1 justify-center items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <Text className="text-5xl font-bold text-primary">Home</Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
