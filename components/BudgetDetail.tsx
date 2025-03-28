import { Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { deleteBudget, updateBudget } from "@/services/budgetService";
import { Ionicons } from "@expo/vector-icons";

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
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this budget?？",
      [
        {
          text: "cancel",
          onPress: () => console.log("Delete operation canceled"),
          style: "cancel",
        },
        {
          text: "confirmed",
          onPress: async () => {
            try {
              await deleteBudget(budgetId as string);
              router.back();
            } catch (error) {
              console.error("Failed to delete budget:", error);
            }
          },
        },
      ],
      { cancelable: false },
    );
  };

  const handleUpdate = () => {
    if (isEditing && newAmount !== String(amount)) {
      Alert.alert(
        "Confirm Update",
        "Are you sure you want to save these changes?",
        [
          {
            text: "cancel",
            onPress: () => console.log("Update operation canceled"),
            style: "cancel",
          },
          {
            text: "confirm",
            onPress: () => {
              const updatedData = {
                category: category as string,
                amount: parseFloat(newAmount), // Update the amount
              };
              console.log("Update budget，ID:", budgetId);

              // Call the updateBudget function with the budgetId and updatedData
              updateBudget(budgetId as string, updatedData)
                .then(() => {
                  // After successful update, save the new amount and switch off editing mode
                  setIsEditing(false);
                  setNewAmount(String(updatedData.amount)); // Update the state with the new amount
                })
                .catch((error) => {
                  console.error("Update budget failed:", error);
                });
            },
          },
        ],
        { cancelable: false },
      );
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
        Budget Details
      </Text>

      <View
        className={`p-6 rounded-2xl shadow-2xl ${
          theme === "dark" ? "bg-dark-800" : "bg-white"
        }`}>
        <Text
          className={`text-lg mb-3 font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}>
          Category: {category}
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
            Budget Amount: ${newAmount}
          </Text>
        )}
      </View>

      <View className="flex-row justify-between mt-8 w-full">
        <TouchableOpacity
          onPress={handleUpdate}
          className="px-8 py-4 bg-green-600 rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-green-500">
          <Text className="text-lg font-semibold text-white">
            {isEditing ? "Save budget" : "Update budget"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          className="px-8 py-4 bg-red-600 rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-red-500">
          <Text className="text-lg font-semibold text-white">
            Delete Budget
          </Text>
        </TouchableOpacity>
      </View>

      {/* 如果预算为0，显示 Set Budget 按钮 */}
      {parseFloat(newAmount) === 0 && (
        <TouchableOpacity
          onPress={() => router.push("/(func)/budget")}
          className={`flex-row items-center p-3 mt-6 rounded-xl shadow-md ${
            theme === "dark" ? "bg-quaternary" : "bg-white"
          }`}>
          <Ionicons
            name="wallet-outline"
            size={20}
            color={theme === "dark" ? "#1477f1" : "#0d6df4"}
          />
          <Text
            className={`ml-4 text-lg font-semibold ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}>
            Set Your Budget
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BudgetDetail;
