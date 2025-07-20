import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys, StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";

import DateChecker from "@/utils/dateChecker";
import PieChartComponent from "@/components/PieChartComponent";
import BarChartComponent from "@/components/BarChartComponent";
import { RefreshControl } from "react-native";

import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  BUDGET_CATEGORIES,
  EXPENSE_CATEGORIES2,
  INCOME_CATEGORIES2,
} from "@/constants/categories";
import { getMonthlyBudget } from "@/services/budgetService";
import { getMonthlyExpensesByCategory } from "@/services/recordService";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../contexts/LanguageContext";
import { demoRecords, demoBudget } from "@/constants/demoData";
import CHART_COLORS from "@/constants/colors";
// import { ID } from "react-native-appwrite";

const Stats = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { translations } = useLanguage();
  const router = useRouter();
  const [monthlyBudgets, setMonthlyBudgets] = useState<any[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isIncome, setIsIncome] = useState<boolean>(false); // State to toggle between income and expense
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;

  const handleToggle = () => {
    // 动画序列
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: isIncome ? 20 : -20,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    setIsIncome(!isIncome);
  };
  const [income, setIncome] = useState<number>(0);
  const [storedDate, setStoredDate] = useState<Date | null>(null);

  const [expense, setExpense] = useState<number>(0);
  const [eventLength, setEventLength] = useState<number>(0);
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]); // Income categories state
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const { language } = useLanguage();
  const getInit = async () => {
    try {
      // get the selectedDate
      // 1. 先读取之前存储的日期字符串
      const storedDateStr = await AsyncStorage.getItem("selectedDate");
      let selectedDate: Date | null = null;
      if (storedDateStr) {
        selectedDate = new Date(storedDateStr);
        console.log("get the selectedDate:", selectedDate);

        setStoredDate(selectedDate);
      } else {
        console.log("not get the selectedDate in AsyncStorage");
      }

      const isGuest = await StorageService.getIsGuest();
      if (isGuest) {
        // 使用演示数据
        const filteredRecords = DateChecker(
          demoRecords as unknown as MoneyRecord[],
        );
        setRecords(filteredRecords);
        setEventLength(demoRecords.length);

        // 计算收入和支出
        const incomeTotal = demoRecords
          .filter((record: any) => record.type === "income")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        const expenseTotal = demoRecords
          .filter((record: any) => record.type === "expense")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        setIncome(incomeTotal);
        setExpense(expenseTotal);

        // 设置预算数据
        setMonthlyBudgets(demoBudget);

        // 计算每个类别的支出
        const expenseCategoryData = demoRecords
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

        setExpensesByCategory(expenseCategoryData);

        // 设置分类数据
        const pieChartExpenseData = (
          language === "zh" ? EXPENSE_CATEGORIES2 : EXPENSE_CATEGORIES
        ).map((category) => ({
          name: category.label,
          population: expenseCategoryData[category.value] || 0,
          color: getRandomColor(),
          legendFontColor: "#7f7f7f",
          legendFontSize: 15,
          icon: category.icon,
        }));

        const incomeCategoryData = demoRecords
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

        const pieChartIncomeData = (
          language === "zh" ? INCOME_CATEGORIES2 : INCOME_CATEGORIES
        ).map((category) => ({
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
        return;
      }

      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      // 尝试从缓存获取统计数据
      const cachedStats = await StorageService.getCachedMonthlyStats();
      if (cachedStats) {
        const { budgets, expenses, records, incomeTotal, expenseTotal } =
          cachedStats;
        setMonthlyBudgets(budgets);
        setExpensesByCategory(expenses);
        setRecords(records);
        setEventLength(records.length);
        setIncome(incomeTotal);
        setExpense(expenseTotal);
        setLoading(false);
      }

      // 无论是否有缓存，都异步获取最新数据
      const userData = await getUserByEmail(email);
      const currentYear = selectedDate!.getFullYear();
      const currentMonth = selectedDate!.getMonth() + 1; // getMonth()从0开始，需要+1
      console.log(currentYear, currentMonth);
      const [budgets, expenses, records] = await Promise.all([
        getMonthlyBudget(userData.$id, currentYear, currentMonth),
        getMonthlyExpensesByCategory(userData.$id, currentYear, currentMonth),
        getRecords(userData.$id),
      ]);
      console.log("show budget", JSON.stringify(budgets, null, 2));
      // 根据type分类叠加
      const filteredRecords = DateChecker(records as unknown as MoneyRecord[]);
      const incomeTotal = filteredRecords
        .filter((record: any) => record.type === "income")
        .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

      const expenseTotal = filteredRecords
        .filter((record: any) => record.type === "expense")
        .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

      // 更新状态和缓存
      setMonthlyBudgets(budgets);
      setExpensesByCategory(expenses);
      setRecords(filteredRecords);
      setEventLength(records.length);
      setIncome(incomeTotal);
      setExpense(expenseTotal);
      setLoading(false);

      // 缓存最新数据
      await StorageService.cacheMonthlyStats({
        budgets,
        expenses,
        records: filteredRecords,
        incomeTotal,
        expenseTotal,
      });

      // categoryData
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
      //
      const pieChartExpenseData = (
        language === "zh" ? EXPENSE_CATEGORIES2 : EXPENSE_CATEGORIES
      ).map((category) => ({
        name: category.label, // 使用 category.label 作为名称
        population: categoryData[category.value] || 0,
        color: getRandomColor(),
        legendFontColor: "#7f7f7f",
        legendFontSize: 15,
        icon: category.icon,
      }));
      // const pieChartExpenseData = EXPENSE_CATEGORIES.map((category) => ({
      //   name: translations.categories[category.value],
      //   population: categoryData[category.value] || 0,
      //   color: getRandomColor(),
      //   legendFontColor: "#7f7f7f",
      //   legendFontSize: 15,
      //   icon: category.icon,
      // }));
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
      const pieChartIncomeData = (
        language === "zh" ? INCOME_CATEGORIES2 : INCOME_CATEGORIES
      ).map((category) => ({
        name: category.label,
        population: incomeCategoryData[category.value] || 0,
        color: getRandomColor(),
        legendFontColor: "#7f7f7f",
        legendFontSize: 15,
        icon: category.icon,
      }));
      // const pieChartIncomeData = INCOME_CATEGORIES.map((category) => ({
      //   name: translations.categories[category.value],
      //   population: incomeCategoryData[category.value] || 0,
      //   color: getRandomColor(),
      //   legendFontColor: "#7f7f7f",
      //   legendFontSize: 15,
      //   icon: category.icon,
      // }));
      setExpenseCategories(pieChartExpenseData);
      setIncomeCategories(pieChartIncomeData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user or records:", error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // 页面每次聚焦时调用 getInit 刷新数据
      getInit();
    }, []),
  );

  const getRandomColor = () => {
    // 随机获取一个颜色
    const randomIndex = Math.floor(Math.random() * CHART_COLORS.length);
    return CHART_COLORS[randomIndex];
  };

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

      const pieChartExpenseData = (
        language === "zh" ? EXPENSE_CATEGORIES2 : EXPENSE_CATEGORIES
      ).map((category) => ({
        name: category.label, // 使用 category.label 作为名称
        population: categoryData[category.value] || 0, // 使用 categoryData 获取数据
        color: getRandomColor(), // 假设 getRandomColor 已定义
        legendFontColor: "#7f7f7f",
        legendFontSize: 15,
        icon: category.icon, // 包含图标
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

      const pieChartIncomeData = (
        language === "zh" ? INCOME_CATEGORIES2 : INCOME_CATEGORIES
      ).map((category) => ({
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

  // refreshing
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className={`flex-1 ${isDark ? "bg-gray-900" : ""} `}
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
          isDark ? "bg-gray-900" : "bg-white"
        }`}>
        <Text
          className={`mt-20 text-4xl font-bold text-black ${
            isDark ? "text-white" : ""
          } `}>
          {translations.stats.title}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <View className="p-4">
              <Text
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : ""
                }`}>
                📅 {translations.stats.records}:
                <Text
                  className={` ${
                    isDark ? "text-secondary" : "text-secondary"
                  }`}>
                  {eventLength}
                </Text>
              </Text>
              <Text
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : ""
                }`}>
                💳 {translations.stats.income}:
                <Text className="text-green-500"> ${income}</Text>
              </Text>
              <Text
                className={`text-xl font-semibold ${
                  isDark ? "text-white" : ""
                }`}>
                💵 {translations.stats.expense}:
                <Text className="text-red-500">${expense}</Text>
              </Text>
            </View>

            {/* Add Switch Button to toggle between income and expense pie chart */}
            <View className="flex flex-row justify-between items-center">
              <TouchableOpacity
                onPress={handleToggle}
                className={`px-6 py-3 rounded-full ${
                  isDark
                    ? "bg-gradient-to-r from-gray-700/40 to-gray-600/40"
                    : "bg-gradient-to-r from-gray-100 to-gray-200"
                } 
                  active:opacity-80 transform transition-all duration-200 
                  
                  ${
                    isDark
                      ? "border border-gray-600/50"
                      : "border border-gray-200"
                  }`}>
                <Animated.View
                  className="flex-row items-center space-x-2"
                  style={{
                    transform: [{ scale: scaleAnim }],
                  }}>
                  <Animated.View
                    style={{
                      opacity: opacityAnim,
                      transform: [{ translateX: translateXAnim }],
                    }}>
                    <Ionicons
                      name={isIncome ? "arrow-up-circle" : "arrow-down-circle"}
                      size={24}
                      color={
                        isDark
                          ? isIncome
                            ? "#bbf7d0"
                            : "#bfdbfe"
                          : isIncome
                          ? "#15803d"
                          : "#1d4ed8"
                      }
                    />
                  </Animated.View>
                  <Animated.Text
                    className={`text-xl font-bold ${
                      isDark
                        ? isIncome
                          ? "text-green-200"
                          : "text-blue-200"
                        : isIncome
                        ? "text-green-700"
                        : "text-blue-700"
                    }`}
                    style={{
                      opacity: opacityAnim,
                      transform: [{ translateX: translateXAnim }],
                    }}>
                    {isIncome
                      ? translations.stats.switchToIncome
                      : translations.stats.switchToExpense}
                  </Animated.Text>
                </Animated.View>
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
          </>
        )}
      </View>

      {/* Budget Section */}
      {!loading && (
        <View className={`px-4 mb-6 w-full ${isDark ? "bg-gray-900" : ""} `}>
          <Text
            className={`mb-2 mt-2 text-xl font-bold text-center ${
              theme === "dark" ? "text-white" : "text-secondary"
            }`}>
            {translations.stats.total}
          </Text>
          {BUDGET_CATEGORIES.map((category) => {
            const budget =
              monthlyBudgets && monthlyBudgets.length > 0
                ? monthlyBudgets.find((b: any) => b.category === category.value)
                : null;
            const budgetData = budget || { budgetAmount: 0 };
            const expense = expensesByCategory?.[category.value] || 0;

            return (
              <TouchableOpacity
                key={category.value}
                onPress={() => {
                  const budgetId = budget ? budget.budgetId : null;
                  router.push({
                    pathname: "/(func)/budgetDetail",
                    params: {
                      budgetId,
                      category: category.value,
                      amount: budgetData.budgetAmount,
                    },
                  });
                }}
                className={`flex-row items-center justify-between p-3 mb-2 rounded-lg  ${
                  isDark ? "border bg-transparent" : "bg-white"
                }`}>
                <View className="flex-row items-center">
                  <Text className="mr-2 text-lg">{category.icon}</Text>
                  <Text
                    className={`text-base font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-700"
                    }`}>
                    {
                      translations.categories[
                        category.value as keyof typeof translations.categories
                      ]
                    }
                  </Text>
                </View>
                <View>
                  <Text
                    className={`text-base font-semibold ${
                      theme === "dark" ? "text-secondary" : "text-gray-700"
                    }`}>
                    ${expense}/{budgetData.budgetAmount}
                  </Text>
                  <Text
                    style={{
                      color:
                        budgetData.budgetAmount - expense > 0
                          ? "green"
                          : budgetData.budgetAmount - expense < 0
                          ? "red"
                          : isDark
                          ? "white"
                          : "black",
                    }}>
                    ${budgetData.budgetAmount - expense}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
          <View className="items-center mt-2">
            <TouchableOpacity
              onPress={() => router.push("/(func)/Budget")}
              className={`flex-row justify-center items-center px-4 py-2 border-gray-200 shadow-md border rounded-full ${
                isDark ? "bg-secondary" : "bg-[#e6f7ff]"
              }`}
              style={{ width: "70%" }} // 控制宽度更短
            >
              <Ionicons
                name="wallet-outline"
                size={24}
                color={isDark ? "#1477f1" : "#0d6df4"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-700"
                }`}>
                {translations.alerts.budget.updateBudget}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}; // Stats组件结束

export default Stats;
