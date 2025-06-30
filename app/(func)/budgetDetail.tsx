import { Text, View, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { deleteBudget, updateBudget } from "@/services/budgetService";
import BackButton from "@/components/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";

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
            onPress: async () => {
              try {
                const updatedData = {
                  category: category as string,
                  amount: parseFloat(newAmount),
                  year: new Date().getFullYear(),
                  month: new Date().getMonth() + 1,
                };
                console.log("Updating budget with ID:", budgetId);

                const result = await updateBudget(
                  budgetId as string,
                  updatedData,
                );
                if (result) {
                  setIsEditing(false);
                  setNewAmount(String(updatedData.amount));
                  // 清除缓存，强制下次进入统计页面时重新获取数据
                  await AsyncStorage.removeItem(StorageKeys.MONTHLY_STATS);
                  Alert.alert(
                    translations.alerts.budget.updateTitle,
                    translations.common.success,
                  );
                  // 返回上一页，触发统计页面刷新
                  router.back();
                }
              } catch (error) {
                console.error("Update budget failed:", error);
                Alert.alert(
                  translations.alerts.budget.updateTitle,
                  translations.common.error,
                );
              }
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
      <BackButton />

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
                ? translations.common.update
                : translations.common.edit}
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
        <View
          className={`p-3 mt-6 w-full rounded-xl shadow-sm ${
            theme === "dark" ? "bg-gray-800/30" : "bg-gray-100"
          }`}>
          <Text
            className={`text-lg font-semibold ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}>
            {translations.stats.noData}
          </Text>
        </View>
      )}
    </View>
  );
};

export default BudgetDetail;
