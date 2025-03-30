/*
 * @Date: 2025-03-28 20:17:02
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-30 15:08:19
 * @FilePath: /Money_Recorder/app/(tabs)/goals.tsx
 */
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import DepositBox from "../../components/DepositBox";

import { Ionicons } from "@expo/vector-icons";

const Goals = () => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <View
      className={`flex-1 mt-20 items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <Text className="text-2xl font-extrabold text-secondary">
        Deposit Goal
      </Text>
      <DepositBox />

      {/* 添加目标按钮 */}
      <TouchableOpacity
        onPress={() => router.push("/(func)/depositGoal")}
        className={`absolute bottom-8 right-8 p-4 rounded-full shadow-lg ${
          theme === "dark" ? "bg-blue-600" : "bg-blue-500"
        }`}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Goals;
