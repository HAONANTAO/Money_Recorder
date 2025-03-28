import { Text, View, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { deleteBudget, updateBudget } from "@/services/budgetService";

const BudgetDetail = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { budgetId, category, amount } = useLocalSearchParams();

  // Track the budget amount in state
  const [newAmount, setNewAmount] = useState<string>(String(amount));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Initialize with the passed amount when the component mounts
    setNewAmount(String(amount));
  }, [amount]);

  const handleDelete = async () => {
    try {
      await deleteBudget(budgetId as string);
      router.back();
    } catch (error) {
      console.error("删除预算失败:", error);
    }
  };

  const handleUpdate = () => {
    if (isEditing && newAmount !== String(amount)) {
      // Construct the updated data object
      const updatedData = {
        category: category as string,
        amount: parseFloat(newAmount), // Update the amount
      };
      console.log("更新预算，ID:", budgetId);

      // Call the updateBudget function with the budgetId and updatedData
      updateBudget(budgetId as string, updatedData)
        .then(() => {
          // After successful update, save the new amount and switch off editing mode
          setIsEditing(false);
          setNewAmount(String(updatedData.amount)); // Update the state with the new amount
        })
        .catch((error) => {
          console.error("更新预算失败:", error);
        });
    } else {
      setIsEditing(true); // Switch to edit mode
    }
  };

  return (
    <View
      className={`flex-1 p-8 justify-center items-center ${
        theme === "dark" ? "bg-dark-900" : "bg-gray-50"
      }`}>
      <Text
        className={`text-3xl font-bold mb-6 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}>
        预算详情
      </Text>

      <View
        className={`p-6 rounded-2xl shadow-2xl ${
          theme === "dark" ? "bg-dark-800" : "bg-white"
        }`}>
        <Text
          className={`text-lg mb-3 font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>
          类别: {category}
        </Text>

        {isEditing ? (
          <TextInput
            value={newAmount}
            onChangeText={setNewAmount}
            keyboardType="numeric"
            className="p-3 mb-6 text-xl rounded-lg border border-gray-300 shadow-sm"
          />
        ) : (
          <Text
            className={`text-lg mb-3 ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}>
            预算金额: ${newAmount}
          </Text>
        )}
      </View>

      <View className="flex-row justify-between mt-8 w-full">
        <TouchableOpacity
          onPress={handleUpdate}
          className="px-8 py-4 bg-green-600 rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-green-500">
          <Text className="text-lg font-semibold text-white">
            {isEditing ? "保存预算" : "更新预算"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="px-8 py-4 bg-red-600 rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-red-500">
          <Text className="text-lg font-semibold text-white">删除预算</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BudgetDetail;
