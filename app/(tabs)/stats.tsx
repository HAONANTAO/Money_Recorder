import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
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

const Stats = () => {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const router = useRouter();
  const [monthlyBudgets, setMonthlyBudgets] = useState<any>(null);
  const [expensesByCategory, setExpensesByCategory] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isIncome, setIsIncome] = useState<boolean>(false); // State to toggle between income and expense charts
  // const [refreashing, setRefreshing] = useState<boolean>(false);
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [eventLength, setEventLength] = useState<number>(0);
  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<any[]>([]); // Income categories state

  // 根据当前语言获取类别名称
  // const getCategoryLabel = (category: any) => {
  //   const categoryTranslations = translations?.categories || {};
  //   return (
  //     categoryTranslations[category.value] || category.label || category.value
  //   );
  // };
  const { language } = useLanguage();

  useEffect(() => {
    const getInit = async () => {
      try {
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
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const [budgets, expenses, records] = await Promise.all([
          getMonthlyBudget(userData.$id, currentYear, currentMonth),
          getMonthlyExpensesByCategory(userData.$id, currentYear, currentMonth),
          getRecords(userData.$id),
        ]);

        // 根据type分类叠加
        const filteredRecords = DateChecker(
          records as unknown as MoneyRecord[],
        );
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

    getInit();
  }, []);

  const CHART_COLORS: string[] = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#E7E9ED",
    "#2ECC71",
    "#E74C3C",
    "#3498DB",
    "#F1C40F",
    "#9B59B6",
    "#1ABC9C",
    "#E67E22",
    "#34495E",
  ];

  // const [colorIndex, setColorIndex] = useState<number>(0);
  const getRandomColor = () => {
    // 随机获取一个颜色
    const randomIndex = Math.floor(Math.random() * CHART_COLORS.length);
    return CHART_COLORS[randomIndex];
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
          {translations.stats.title}
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <View className="p-4">
              <Text className="text-xl font-semibold">
                📅 {translations.stats.records}:
                <Text className="text-tertiary"> {eventLength}</Text>
              </Text>
              <Text className="text-xl font-semibold">
                💳 {translations.stats.income}:
                <Text className="text-tertiary"> ${income}</Text>
              </Text>
              <Text className="text-xl font-semibold">
                💵 {translations.stats.expense}:
                <Text className="text-tertiary">${expense}</Text>
              </Text>
            </View>

            {/* Add Switch Button to toggle between income and expense pie chart */}
            <View className="flex flex-row justify-between items-center">
              <TouchableOpacity onPress={() => setIsIncome(!isIncome)}>
                <Text className="text-xl font-bold text-secondary">
                  {isIncome
                    ? translations.stats.switchToIncome
                    : translations.stats.switchToExpense}
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
            {translations.stats.total}
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
              onPress={() => router.push("/(func)/Budget")}
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
                {translations.stats.setBudget}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}; // Stats组件结束

const styles = StyleSheet.create({});

export default Stats;
function getInit() {
  throw new Error("Function not implemented.");
}
