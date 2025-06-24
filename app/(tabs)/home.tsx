/*
 * @Date: 2025-03-21 21:26:12
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-24 22:15:23
 * @FilePath: /Money_Recorder/app/(tabs)/home.tsx
 */
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys, StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";
import RecordShowBox from "@/components/RecordShowbox";
import DateChecker from "@/utils/dateChecker";

import { demoRecords } from "@/constants/demoData";
import BudgetDisplayBar from "@/components/BudgetDisplayBar";

// 获取当前日期，只需要月份就可以了
const getCurrentDate = () => {
  const date = new Date();
  const { language } = useLanguage();
  const locale = language === "zh" ? "zh-CN" : "en-US";
  return date.toLocaleDateString(locale, {
    // weekday: "long",
    month: "long",
    year: "numeric",
    // day: "numeric",
  });
};

const Home = () => {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const isDark = theme === "dark";

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const calculateMonthlyStats = (filteredRecords: MoneyRecord[]) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyRecords = filteredRecords.filter((record: any) => {
      const recordDate = new Date(record.createAt);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });

    const totalIncome = monthlyRecords
      .filter((record: any) => record.type === "income")
      .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

    const totalExpense = monthlyRecords
      .filter((record: any) => record.type === "expense")
      .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

    setMonthlyIncome(totalIncome);
    setMonthlyExpense(totalExpense);
  };

  const getInit = async () => {
    try {
      const isGuest = await StorageService.getIsGuest();
      if (isGuest) {
        const filteredRecords = DateChecker(
          demoRecords as unknown as MoneyRecord[],
        );
        setRecords(filteredRecords);
        calculateMonthlyStats(filteredRecords);
        setLoading(false);
        return;
      }

      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      // 检查用户是否已删除账号
      const isDeleted = await StorageService.getIsDeleted();
      if (isDeleted) return;

      // 尝试从缓存获取数据
      const cachedRecords = await StorageService.getCachedRecords();
      if (cachedRecords) {
        const filteredRecords = DateChecker(
          cachedRecords as unknown as MoneyRecord[],
        );
        setRecords(filteredRecords);
        calculateMonthlyStats(filteredRecords);
        setLoading(false);
      }

      // 无论是否有缓存，都异步获取最新数据
      const userData = await getUserByEmail(email);
      const [user, records] = await Promise.all([
        getUserByEmail(email),
        getRecords(userData.$id),
      ]);

      const filteredRecords = DateChecker(records as unknown as MoneyRecord[]);
      setRecords(filteredRecords);
      await StorageService.cacheRecords(records);

      calculateMonthlyStats(filteredRecords);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user or records:", error);
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getInit().then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    getInit();
  }, [records]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View
        className={` flex-1 ${
          isDark ? "bg-gray-900" : "bg-gray-100"
        } pt-10 px-4 `}>
        {/* 今天日期 */}
        <Text
          className={`mt-8 text-2xl font-bold text-center ${
            isDark ? "text-white" : "text-gray-800"
          }`}>
          {getCurrentDate()}
        </Text>

        {/* 总金额View - 本月总和和明细 */}
        <View
          className={`mt-6 p-6 rounded-2xl space-y-4 ${
            isDark ? "border border-white" : "bg-gray-800"
          }`}>
          <View className="flex flex-row justify-between items-center">
            <Text
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-200"
              }`}>
              {translations.home.monthlyIncome}
            </Text>
            <Text
              className={`text-4xl font-extrabold ml-2 ${
                monthlyIncome - monthlyExpense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}>
              ${(monthlyIncome - monthlyExpense).toFixed(2)}
            </Text>
          </View>
          {/* 小组件显示支出和收入 */}
          <View className="space-y-2">
            {/* Net Worth View */}
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-400">
                {translations.home.monthlyIncome}
              </Text>
              <Text className="text-sm font-bold text-gray-400">
                $ {monthlyIncome.toFixed(2)}
              </Text>
            </View>

            {/* Loss View */}
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-400">
                {translations.home.monthlyExpense}
              </Text>
              <Text className="text-sm font-bold text-gray-400">
                $ {monthlyExpense.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* myBudget预算bar显示 */}
        <View className="mt-6">
          <BudgetDisplayBar
            currentBudget={monthlyExpense}
            totalBudget={2000} // 设置一个固定的月度预算
          />
        </View>
        {/* details */}
        <View
          className={`p-4 mt-6 rounded-2xl border ${
            isDark ? "border-white" : "border-gray-200"
          }`}>
          <View className="flex flex-row flex-wrap justify-around">
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : records.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Text
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}>
                  {translations.record.none}
                </Text>
              </View>
            ) : (
              <View className="flex-1 mt-6">
                {Object.entries(
                  records
                    .sort(
                      (a, b) =>
                        new Date(b.createAt).getTime() -
                        new Date(a.createAt).getTime(),
                    )
                    .reduce(
                      (groups: { [key: string]: MoneyRecord[] }, record) => {
                        const date = new Date(
                          record.createAt,
                        ).toLocaleDateString();
                        if (!groups[date]) {
                          groups[date] = [];
                        }
                        groups[date].push(record);
                        return groups;
                      },
                      {},
                    ),
                ).map(([date, groupRecords]) => (
                  <View key={date} className="mb-6">
                    <Text
                      className={`text-lg font-semibold mb-3 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}>
                      {date}
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                      {groupRecords.map((record) => (
                        <RecordShowBox key={record.$id} record={record} />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
