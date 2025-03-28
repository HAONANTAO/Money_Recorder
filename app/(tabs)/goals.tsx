import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
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

  const [userId, setUserId] = useState<string | null>(null);
  const [monthlyBudgets, setMonthlyBudgets] = useState<any>(null);
  const [expensesByCategory, setExpensesByCategory] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      // 获取用户邮箱并获取用户信息
      const email = await StorageService.getEmail();
      if (!email) {
        console.error("No email found in storage");
        return;
      }

      const user = await getUserByEmail(email);
      const userId = user.$id as string;
      setUserId(userId);

      // 获取用户预算
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const budgets = await getMonthlyBudget(userId, currentYear, currentMonth);
      setMonthlyBudgets(budgets);

      // 获取按类别的支出
      const result = await getMonthlyExpensesByCategory(
        userId,
        currentYear,
        currentMonth,
      );
      setExpensesByCategory(result);
    } catch (error) {
      console.error("获取预算失败:", error);
    } finally {
      setIsRefreshing(false); // 刷新结束
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // 只在组件挂载时执行一次

  return (
    <View
      className={`flex-1 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <ScrollView
        className="px-6 py-10"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={fetchData} // 触发刷新时重新获取数据
            tintColor={theme === "dark" ? "#1477f1" : "#0d6df4"} // 设置刷新指示器的颜色
            progressBackgroundColor={theme === "dark" ? "#333" : "#fff"} // 设置刷新指示器背景色
          />
        }>
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
              const budget = monthlyBudgets?.find(
                (b: any) => b.category === category.value,
              ) || { budgetAmount: 0 };
              const expense = expensesByCategory?.[category.value] || 0;

              return (
                <TouchableOpacity
                  key={category.value}
                  onPress={() => {
                    const budgetId = budget?.budgetId;
                    router.push({
                      pathname: "/(func)/budgetDetail",
                      params: {
                        budgetId,
                        category: category.value,
                        amount: budget?.budgetAmount,
                      },
                    });
                  }}
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
                  <View>
                    <Text
                      className={`text-base font-semibold ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}>
                      ${expense}/{budget?.budgetAmount}
                    </Text>
                    <Text
                      style={{
                        color:
                          budget?.budgetAmount - expense > 0
                            ? "green"
                            : budget?.budgetAmount - expense < 0
                            ? "red"
                            : "black",
                      }}>
                      ${budget?.budgetAmount - expense}
                    </Text>
                  </View>
                </TouchableOpacity>
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
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({});
