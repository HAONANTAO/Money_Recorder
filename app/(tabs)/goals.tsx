/*
 * @Date: 2025-03-28 20:17:02
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-02 13:23:29
 * @FilePath: /Money_Recorder/app/(tabs)/goals.tsx
 */
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import DepositBox from "../../components/DepositBox";

import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../contexts/LanguageContext";
import { demoGoals } from "@/constants/demoData";
import { StorageService } from "@/utils/storageService";

const Goals = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const checkGuestMode = async () => {
      const isGuest = await StorageService.getIsGuest();
      setIsGuest(isGuest);
    };
    checkGuestMode();
  }, []);

  return (
    <View
      className={`flex-1 mt-20 items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <Text className="text-2xl font-extrabold text-secondary">
        {translations.goals.title}
      </Text>
      <DepositBox demoData={isGuest ? demoGoals : undefined} />

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
