import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { getMonthlyBudget } from "../../services/budgetService";
import { BUDGET_CATEGORIES } from "../../constants/categories";
import { StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getMonthlyExpensesByCategory } from "@/services/recordService";

const Goals = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [userId, setUserId] = useState("");
  const [monthlyBudgets, setMonthlyBudgets] = useState<any>(null);
  const [expensesByCategory, setExpensesByCategory] = useState<any>(null);
  useEffect(() => {
    const getInitialUserAndFetchBudgets = async () => {
      try {
        // Step 1: Get user email and fetch user details
        const email = await StorageService.getEmail();
        const user = await getUserByEmail(email as unknown as string);
        const userId = user.$id as unknown as string;
        setUserId(userId);

        // console.log("这里的user是：", userId);

        // Step 2: Fetch budgets once userId is available
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const budgets = await getMonthlyBudget(
          userId,
          currentYear,
          currentMonth,
        );
        setMonthlyBudgets(budgets);
        const result = await getMonthlyExpensesByCategory(
          userId,
          currentYear,
          currentMonth,
        );
        setExpensesByCategory(result);
      } catch (error) {
        console.error("获取预算失败:", error);
      }
    };
    // 拿到userid后再去
    getInitialUserAndFetchBudgets();
    console.log("xxx", monthlyBudgets);
    // console.log("分类", expensesByCategory);
  }, [monthlyBudgets]);

  return (
    <View
      className={`flex-1 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <ScrollView className="px-6 py-10">
        <Text
          className={`mb-8 text-3xl font-extrabold text-center ${
            theme === "dark" ? "text-gray-200" : "text-gray-800"
          }`}>
          Goals
        </Text>

        {monthlyBudgets && (
          <View className="mb-6">
            <Text
              className={`mb-4 text-xl font-bold ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}>
              本月预算
            </Text>
            {BUDGET_CATEGORIES.map((category) => {
              // 获取该类别的预算记录（从monthlyBudgets查找该类别的预算金额）
              const budget = monthlyBudgets?.find(
                (b: any) => b.category === category.value,
              ) || { budgetAmount: 0 };

              // 获取该类别的支出
              const expense = expensesByCategory?.[category.value] || 0;

              return (
                <View
                  key={category.value}
                  className={`flex-row items-center justify-between p-3 mb-2 rounded-lg ${
                    theme === "dark" ? "bg-tertiary" : "bg-white"
                  }`}>
                  <View className="flex-row items-center">
                    <Text className="mr-2 text-lg">{category.icon}</Text>
                    <Text
                      className={`text-base font-medium ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}>
                      {category.label}
                    </Text>
                  </View>
                  <Text
                    className={`text-base font-semibold ${
                      theme === "dark" ? "text-gray-200" : "text-gray-700"
                    }`}>
                    ${expense}/{budget?.budgetAmount}
                  </Text>
                  {/* 让正数就显示绿色 负数显示红色 0是黑色呢 */}
                  <Text
                    style={{
                      color:
                        budget?.budgetAmount - expense > 0
                          ? "green" // 正数为绿色
                          : budget?.budgetAmount - expense < 0
                          ? "red" // 负数为红色
                          : "black", // 0 为黑色
                    }}>
                    ${budget?.budgetAmount - expense}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          onPress={() => router.push("/(func)/budget")}
          className={`flex-row items-center p-4 rounded-xl shadow-md ${
            theme === "dark" ? "bg-quaternary" : "bg-white"
          }`}>
          <Ionicons
            name="wallet-outline"
            size={24}
            color={theme === "dark" ? "#1477f1" : "#0d6df4"}
          />
          <Text
            className={`ml-4 text-lg font-semibold ${
              theme === "dark" ? "text-gray-200" : "text-gray-700"
            }`}>
            Set Budget
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Proper closing tag for ScrollView */}
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({});
