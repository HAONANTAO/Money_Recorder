import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { deleteBudget, updateBudget } from "@/services/budgetService";

const BudgetDetail = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { budgetId, category, amount } = useLocalSearchParams();
  console.log("先看看", budgetId, category, amount);
  // 确保amount是数字类型
  const parsedAmount = parseFloat(amount as string);

  const [isEditing, setIsEditing] = useState(false);
  const [newAmount, setNewAmount] = useState<string>(String(parsedAmount));

  const handleDelete = async () => {
    try {
      await deleteBudget(budgetId as string);
      router.back();
    } catch (error) {
      console.error("删除预算失败:", error);
    }
  };

  const handleUpdate = () => {
    if (isEditing && newAmount !== String(parsedAmount)) {
      // 构建更新的数据对象，确保类型匹配
      const updatedData = {
        category: category as string,
        amount: parseFloat(newAmount), // 更新金额
      };
      console.log("更新预算，ID:", budgetId);
      // 调用 updateBudget，传递 budgetId 和 updatedData
      updateBudget(budgetId as string, updatedData)
        .then(() => {
          setIsEditing(false); // 更新成功后切换回非编辑模式
        })
        .catch((error) => {
          console.error("更新预算失败:", error);
        });
    } else {
      setIsEditing(true); // 切换为编辑模式
    }
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
            theme === "dark" ? "text-gray-300" : "text-gray600"
          }`}>
          类别: {category}
        </Text>

        {isEditing ? (
          <TextInput
            value={newAmount}
            onChangeText={setNewAmount}
            keyboardType="numeric"
            className="p-2 rounded border"
          />
        ) : (
          <Text
            className={`text-lg mb-2 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}>
            预算金额: ${parsedAmount}
          </Text>
        )}
      </View>

      <View className="flex-row justify-around">
        <TouchableOpacity
          onPress={handleUpdate}
          className="px-6 py-3 bg-blue-500 rounded-lg">
          <Text className="font-semibold text-white">
            {isEditing ? "保存预算" : "更新预算"}
          </Text>
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
