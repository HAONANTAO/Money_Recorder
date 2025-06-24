/*
 * @Date: 2025-06-24 22:17:35
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-24 22:28:45
 * @FilePath: /Money_Recorder/components/BudgetDisplayBar.tsx
 */
import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

interface BudgetDisplayBarProps {
  currentBudget?: number;
  totalBudget?: number;
}

const BudgetDisplayBar: React.FC<BudgetDisplayBarProps> = ({
  currentBudget = 0,
  totalBudget = 1000,
}) => {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const isDark = theme === "dark";

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
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
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
        <Text
          className={`text-sm font-bold ${
            isDark ? "text-white" : "text-gray-800"
          }`}>
          {formatMoney(currentBudget)} / {formatMoney(totalBudget)}
        </Text>
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
