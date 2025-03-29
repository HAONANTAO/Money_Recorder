import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";
import RecordShowBox from "@/components/RecordShowbox";
import DateChecker from "@/utils/dateChecker";
import PieChartComponent from "@/components/PieChartComponent";
import BarChartComponent from "@/components/BarChartComponent";
import { RefreshControl } from "react-native";

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  BUDGET_CATEGORIES,
} from "@/constants/categories";
import { getMonthlyBudget } from "@/services/budgetService";
import { getMonthlyExpensesByCategory } from "@/services/recordService";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Stats = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const [monthlyBudgets, setMonthlyBudgets] = useState<any>(null);
  const [expensesByCategory, setExpensesByCategory] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isIncome, setIsIncome] = useState<boolean>(false); // State to toggle between income and expense charts
  const [refreashing, setRefreshing] = useState<boolean>(false);
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [eventLength, setEventLength] = useState<number>(0);

  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]); // Income categories state

  useEffect(() => {
    const getInit = async () => {
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      const userData = await getUserByEmail(email);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const [budgets, expenses] = await Promise.all([
        getMonthlyBudget(userData.$id, currentYear, currentMonth),
        getMonthlyExpensesByCategory(userData.$id, currentYear, currentMonth),
      ]);
      setMonthlyBudgets(budgets);
      setExpensesByCategory(expenses);

      try {
        const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
        if (!email) return;

        const userData = await getUserByEmail(email);
        const [user, records] = await Promise.all([
          getUserByEmail(email),
          getRecords(userData.$id),
        ]);

        setUser(user);
        const filteredRecords = DateChecker(
          records as unknown as MoneyRecord[],
        );
        setRecords(filteredRecords);
        setEventLength(records.length);

        const incomeTotal = filteredRecords
          .filter((record: any) => record.type === "income")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        const expenseTotal = filteredRecords
          .filter((record: any) => record.type === "expense")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        setIncome(incomeTotal);
        setExpense(expenseTotal);

        const categoryData = filteredRecords
          .filter((record: any) => record.type === "expense")
          .reduce((categories: any, record: any) => {
            const category = record.category;
            if (categories[category]) {
              categories[category] += record.moneyAmount;
            } else {
              categories[category] = record.moneyAmount;
            }
            return categories;
          }, {});

        const pieChartExpenseData = EXPENSE_CATEGORIES.map((category) => ({
          name: category.label,
          population: categoryData[category.value] || 0,
          color: getRandomColor(),
          legendFontColor: "#7f7f7f",
          legendFontSize: 15,
          icon: category.icon,
        }));

        const incomeCategoryData = filteredRecords
          .filter((record: any) => record.type === "income")
          .reduce((categories: any, record: any) => {
            const category = record.category;
            if (categories[category]) {
              categories[category] += record.moneyAmount;
            } else {
              categories[category] = record.moneyAmount;
            }
            return categories;
          }, {});

        const pieChartIncomeData = INCOME_CATEGORIES.map((category) => ({
          name: category.label,
          population: incomeCategoryData[category.value] || 0,
          color: getRandomColor(),
          legendFontColor: "#7f7f7f",
          legendFontSize: 15,
          icon: category.icon,
        }));

        setExpenseCategories(pieChartExpenseData);
        setIncomeCategories(pieChartIncomeData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user or records:", error);
        setLoading(false);
      }
    };

    getInit();
  }, []);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      const userData = await getUserByEmail(email);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const [budgets, expenses] = await Promise.all([
        getMonthlyBudget(userData.$id, currentYear, currentMonth),
        getMonthlyExpensesByCategory(userData.$id, currentYear, currentMonth),
      ]);
      setMonthlyBudgets(budgets);

      setExpensesByCategory(expenses);

      const [user, records] = await Promise.all([
        getUserByEmail(email),
        getRecords(userData.$id),
      ]);

      setUser(user);
      const filteredRecords = DateChecker(records as unknown as MoneyRecord[]);
      setRecords(filteredRecords);
      setEventLength(records.length);

      const incomeTotal = filteredRecords
        .filter((record: any) => record.type === "income")
        .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

      const expenseTotal = filteredRecords
        .filter((record: any) => record.type === "expense")
        .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

      setIncome(incomeTotal);
      setExpense(expenseTotal);

      const categoryData = filteredRecords
        .filter((record: any) => record.type === "expense")
        .reduce((categories: any, record: any) => {
          const category = record.category;
          if (categories[category]) {
            categories[category] += record.moneyAmount;
          } else {
            categories[category] = record.moneyAmount;
          }
          return categories;
        }, {});

      const pieChartExpenseData = EXPENSE_CATEGORIES.map((category) => ({
        name: category.label,
        population: categoryData[category.value] || 0,
        color: getRandomColor(),
        legendFontColor: "#7f7f7f",
        legendFontSize: 15,
        icon: category.icon,
      }));

      const incomeCategoryData = filteredRecords
        .filter((record: any) => record.type === "income")
        .reduce((categories: any, record: any) => {
          const category = record.category;
          if (categories[category]) {
            categories[category] += record.moneyAmount;
          } else {
            categories[category] = record.moneyAmount;
          }
          return categories;
        }, {});

      const pieChartIncomeData = INCOME_CATEGORIES.map((category) => ({
        name: category.label,
        population: incomeCategoryData[category.value] || 0,
        color: getRandomColor(),
        legendFontColor: "#7f7f7f",
        legendFontSize: 15,
        icon: category.icon,
      }));

      setExpenseCategories(pieChartExpenseData);
      setIncomeCategories(pieChartIncomeData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreashing]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="flex-1"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={fetchData}
          tintColor={theme === "dark" ? "#1477f1" : "#0d6df4"}
          progressBackgroundColor={theme === "dark" ? "#333" : "#fff"}
        />
      }>
      <View
        className={`flex-1 justify-start items-center ${
          theme === "dark" ? "bg-quaternary" : "bg-white"
        }`}>
        <Text className="mt-20 text-4xl font-bold text-primary">
          Stats Overview
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <View className="p-4">
              <Text className="text-xl font-semibold">
                📅 Total Event: {eventLength}
              </Text>
              <Text className="text-xl font-semibold">
                💳 Total Income: ${income}
              </Text>
              <Text className="text-xl font-semibold">
                💵 Total Expense: ${expense}
              </Text>
            </View>

            {/* Add Switch Button to toggle between income and expense pie chart */}
            <View className="flex flex-row justify-between items-center">
              <TouchableOpacity onPress={() => setIsIncome(!isIncome)}>
                <Text className="text-xl font-bold text-secondary">
                  {isIncome ? "Income Chart" : "Expense Chart"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Display the PieChartComponent and BarChartComponent for either income or expense */}
            <View className="flex flex-row flex-wrap justify-center m-2">
              <PieChartComponent
                data={isIncome ? incomeCategories : expenseCategories}
              />
              <BarChartComponent
                data={isIncome ? incomeCategories : expenseCategories}
              />
            </View>

            {/* <View className="p-4 rounded-2xl border border-gray-200">
              <View className="flex flex-row flex-wrap justify-around">
                {records.length > 0 ? (
                  records.map((record: any) => (
                    <View className="p-2 w-1/2" key={record.$id}>
                      <RecordShowBox record={record} />
                    </View>
                  ))
                ) : (
                  <Text>No records found</Text>
                )}
              </View>
            </View> */}
          </>
        )}
      </View>

      {/* Budget Section */}
      {!loading && (
        <View className="px-4 mb-6 w-full">
          <Text
            className={`mb-2 mt-2 text-xl font-bold text-center ${
              theme === "dark" ? "text-gray-200" : "text-secondary"
            }`}>
            This Month Budget
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
                    pathname: "/(func)/depositGoal",
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
          <View className="items-center mt-2">
            <TouchableOpacity
              onPress={() => router.push("/(func)/budget")}
              className={`flex-row justify-center items-center px-4 py-2 border-gray-200 shadow-md border rounded-full ${
                theme === "dark" ? "bg-secondary" : "bg-[#e6f7ff]"
              }`}
              style={{ width: "70%" }} // 控制宽度更短
            >
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
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default Stats;
