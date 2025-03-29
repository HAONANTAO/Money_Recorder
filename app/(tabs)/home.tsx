/*
 * @Date: 2025-03-21 21:26:12
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-29 15:37:24
 * @FilePath: /Money_Recorder/app/(tabs)/home.tsx
 */
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";
import RecordShowBox from "@/components/RecordShowbox";
import DateChecker from "@/utils/dateChecker";

// 获取当前日期
const getCurrentDate = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);

  const getInit = async () => {
    try {
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      const userData = await getUserByEmail(email);
      const [user, records] = await Promise.all([
        getUserByEmail(email),
        getRecords(userData.$id),
      ]);

      setUser(user);
      const filteredRecords = DateChecker(records as unknown as MoneyRecord[]);
      setRecords(filteredRecords);

      // 计算当月收入和支出
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user or records:", error);
      setLoading(false);
    }
  };

  const onRefresh = React.useCallback(() => {
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
        className={`mt-8 flex-1 ${
          isDark ? "bg-gray-900" : "bg-white"
        } pt-10 px-4 `}>
        {/* 今天日期 */}
        <Text
          className={`${
            isDark ? "text-white" : ""
          } text-2xl font-bold text-center text-gray-800`}>
          {getCurrentDate()}
        </Text>

        {/* 第二个 View - 净资产 */}
        <View
          className={`mt-6 p-4 flex flex-row justify-between gap-4 rounded-lg ${
            isDark ? "bg-primary" : "bg-gray-100"
          }`}>
          {/* Net Worth View */}
          <View className="p-4 rounded-3xl border border-gray-300 dark:border-gray-700">
            <Text
              className={`${
                isDark ? "text-white" : ""
              } text-xl font-bold text-gray-700`}>
              Monthly Income
            </Text>
            <Text className="text-4xl font-extrabold text-green-500">
              ${monthlyIncome.toFixed(2)}
            </Text>
          </View>

          {/* Loss View */}
          <View className="p-4 rounded-3xl border border-gray-300 dark:border-gray-700">
            <Text
              className={`${
                isDark ? "text-white" : ""
              } text-xl font-bold text-gray-700`}>
              Monthly Expense
            </Text>
            <Text className="text-4xl font-extrabold text-red-500">
              ${monthlyExpense.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* 第三个 View - 本月支出 */}
        <View
          className={`mt-6 p-6 rounded-2xl ${
            isDark ? "bg-secondary" : "bg-blue-100"
          }`}>
          <Text className="text-lg font-bold text-gray-700 dark:text-white">
            Net Income This Month
          </Text>
          <Text
            className={`text-5xl font-extrabold ${
              monthlyIncome - monthlyExpense >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}>
            ${(monthlyIncome - monthlyExpense).toFixed(2)}
          </Text>
        </View>

        {/* details */}
        <View className="p-4 mt-6 rounded-2xl border border-gray-200">
          <View className="flex flex-row flex-wrap justify-around">
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : records.length > 0 ? (
              records.map((record: any) => (
                <View className="p-2 w-1/2" key={record.$id}>
                  <RecordShowBox record={record} />
                </View>
              ))
            ) : (
              <Text>No records found</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});
