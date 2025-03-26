/*
 * @Date: 2025-03-21 21:26:12
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-26 15:57:31
 * @FilePath: /Money_Recorder/app/(tabs)/home.tsx
 */
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { center } from "../../node_modules/@shopify/react-native-skia/lib/module/skia/core/Rect";

// 获取当前日期
const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      className={`mt-8 flex-1 ${
        isDark ? "bg-gray-900" : "bg-white"
      } pt-10 px-4 `}>
      {/* 今天日期 */}
      <Text className=" text-2xl font-bold text-center text-gray-800 dark:text-white">
        {getCurrentDate()}
      </Text>

      {/* 第二个 View - 净资产 */}
      <View
        className={`mt-6 p-4 flex flex-row justify-between gap-4 rounded-lg ${
          isDark ? "bg-primary" : "bg-gray-100"
        }`}>
        {/* Net Worth View */}
        <View className="p-4 rounded-3xl border border-gray-300 dark:border-gray-700">
          <Text className="text-xl font-bold text-gray-700 dark:text-white">
            Net Worth
          </Text>
          <Text className="text-4xl font-extrabold text-green-500">
            $12,500
          </Text>
        </View>

        {/* Loss View */}
        <View className="p-4 rounded-3xl border border-gray-300 dark:border-gray-700">
          <Text className="text-xl font-bold text-gray-700 dark:text-white">
            Loss
          </Text>
          <Text className="text-4xl font-extrabold text-red-500">$2,300</Text>
        </View>
      </View>

      {/* 第三个 View - 本月支出 */}
      <View
        className={`mt-6 p-6 rounded-2xl flex-1 justify-center items-center ${
          isDark ? "bg-secondary" : "bg-blue-100"
        }`}>
        <Text className="text-lg font-bold text-gray-700 dark:text-white">
          This Month's Expenses
        </Text>
        <Text className="text-5xl font-extrabold text-red-500">$1,200</Text>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
