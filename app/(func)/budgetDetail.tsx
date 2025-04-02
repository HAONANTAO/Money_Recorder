import { Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { deleteBudget, updateBudget } from "@/services/budgetService";
import BackButton from "@/components/BackButton";

const BudgetDetail = () => {
  const { theme } = useTheme();
  const { translations } = useLanguage();
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
      translations.alerts.budget.deleteTitle,
      translations.alerts.budget.deleteMessage,
      [
        {
          text: translations.common.cancel,
          onPress: () => console.log("Delete operation canceled"),
          style: "cancel",
        },
        {
          text: translations.common.confirm,
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
        translations.alerts.budget.updateTitle,
        translations.alerts.budget.updateMessage,
        [
          {
            text: translations.common.cancel,
            onPress: () => console.log("Update operation canceled"),
            style: "cancel",
          },
          {
            text: translations.common.confirm,
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
      <View className="relative right-6 bottom-32">
        <BackButton />
      </View>

      <Text
        className={`text-3xl font-bold mb-6 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}>
        {translations.stats.total}
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
            {translations.stats.total}: ${newAmount}
          </Text>
        )}
      </View>

      {/* Conditional rendering for the buttons */}
      {parseFloat(newAmount) !== 0 && (
        <View className="flex-row justify-between mt-8 w-full">
          <TouchableOpacity
            onPress={handleUpdate}
            className="px-8 py-4 bg-green-600 rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-green-500">
            <Text className="text-lg font-semibold text-white">
              {isEditing
                ? translations.common.confirm
                : translations.common.confirm}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDelete}
            className="px-8 py-4 bg-red-600 rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-red-500">
            <Text className="text-lg font-semibold text-white">
              {translations.common.clear}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* If the budget amount is 0, show the message */}
      {parseFloat(newAmount) === 0 && (
        <View className="p-3 mt-6 w-full bg-red-100 rounded-xl shadow-md">
          <Text
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}>
            {translations.stats.noData}
          </Text>
        </View>
      )}
    </View>
  );
};

export default BudgetDetail;
