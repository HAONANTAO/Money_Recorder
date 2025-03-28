import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { deleteBudget, updateBudget } from "@/services/budgetService";

const BudgetDetail = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { budgetId, category, amount } = useLocalSearchParams();

  const handleDelete = async () => {
    try {
      await deleteBudget(budgetId as string);
      router.back();
    } catch (error) {
      console.error("删除预算失败:", error);
    }
  };

  const handleUpdate = () => {
    router.push({
      pathname: "/(func)/budgetModify",
      params: { budgetId, category, amount },
    });
  };

  return (
    <View
      className={`flex-1 p-6 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <Text
        className={`text-2xl font-bold mb-6 ${
          theme === "dark" ? "text-gray-200" : "text-gray-800"
        }`}>
        预算详情
      </Text>

      <View
        className={`p-4 rounded-lg mb-6 ${
          theme === "dark" ? "bg-tertiary" : "bg-white"
        }`}>
        <Text
          className={`text-lg mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
          类别: {category}
        </Text>
        <Text
          className={`text-lg mb-2 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
          预算金额: ${amount}
        </Text>
      </View>

      <View className="flex-row justify-around">
        <TouchableOpacity
          onPress={handleUpdate}
          className="px-6 py-3 bg-blue-500 rounded-lg">
          <Text className="font-semibold text-white">更新预算</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="px-6 py-3 bg-red-500 rounded-lg">
          <Text className="font-semibold text-white">删除预算</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BudgetDetail;

const styles = StyleSheet.create({});
