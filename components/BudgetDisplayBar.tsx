/*
 * @Date: 2025-06-24 22:17:35
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-28 15:56:15
 * @FilePath: /Money_Recorder/components/BudgetDisplayBar.tsx
 */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Ionicons } from "@expo/vector-icons";

interface BudgetDisplayBarProps {
  currentBudget?: number;
  totalBudget?: number;
  onBudgetChange?: (value: number) => void;
}

const BudgetDisplayBar: React.FC<BudgetDisplayBarProps> = ({
  currentBudget = 0,
  totalBudget = 2000,
  onBudgetChange,
}) => {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const isDark = theme === "dark";

  const handleBudgetPress = () => {
    if (onBudgetChange) {
      onBudgetChange(totalBudget);
    }
  };

  const percentage = Math.min((currentBudget / totalBudget) * 100, 100);
  const barColor =
    percentage > 90
      ? "bg-red-500"
      : percentage > 70
      ? "bg-orange-500"
      : percentage > 50
      ? "bg-yellow-500"
      : "bg-green-500";

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <View className="p-4 w-full bg-opacity-20 rounded-xl">
      <View className="flex-row justify-between mb-2">
        <Text
          className={`text-sm font-medium ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
          {translations.BudgetUsage} ({percentage.toFixed(1)}%)
        </Text>
        <View className="flex-row items-center">
          <Text
            className={`text-sm font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}>
            {formatMoney(currentBudget)} /
            <Text
              className={`${isDark ? "text-white" : "text-gray-800"}`}>
              {formatMoney(totalBudget)}
            </Text>
          </Text>
          <TouchableOpacity
            onPress={handleBudgetPress}
            className="ml-2 p-1">
            <Ionicons
              name="pencil"
              size={16}
              color={isDark ? "#fff" : "#1f2937"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="overflow-hidden w-full h-2 bg-gray-200 rounded-full">
        <View
          className={`${barColor} rounded-full`}
          style={{
            width: `${percentage}%`,
            // h-full 并不是总能像在 Web 上那样正常工作。
            height: 8, // ✅ 直接给像素值，避免 h-full 问题
          }}
        />
      </View>
    </View>
  );
};

export default BudgetDisplayBar;
