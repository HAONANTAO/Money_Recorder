/*
 * @Date: 2025-03-21 21:26:12
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-01 15:43:14
 * @FilePath: /Money_Recorder/app/(tabs)/home.tsx
 */
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys, StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";
import RecordShowBox from "@/components/RecordShowbox";
import DateChecker from "@/utils/dateChecker";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// 获取当前日期
const getCurrentDate = () => {
  const date = new Date();
  const { language } = useLanguage();
  const locale = language === "zh" ? "zh-CN" : "en-US";
  return date.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Home = () => {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const isDark = theme === "dark";
  // const [user, setUser] = useState<any>(null);
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
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

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
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme === "dark" ? "#1477f1" : "#0d6df4"}
          progressBackgroundColor={theme === "dark" ? "#333" : "#fff"}
        />
      }>
      <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-white"} px-4`}>
        {/* 今天日期 */}
        <Text
          className={`mt-20 ${
            isDark ? "text-white" : ""
          } text-2xl font-bold text-center text-gray-800`}>
          {getCurrentDate()}
        </Text>
        {/* search bar */}
        <View className="flex items-center mt-6">
          <TouchableOpacity
            onPress={() => router.push("/(func)/searchbar")}
            className={`p-4 rounded-2xl shadow-lg ${
              isDark ? "bg-secondary" : "bg-white"
            } w-full active:opacity-80 flex-row items-center justify-between`}>
            <View className="flex-row flex-1 items-center">
              <View className="mr-3">
                <Ionicons
                  name="search-outline"
                  size={24}
                  color={isDark ? "#fff" : "#4B5563"}
                />
              </View>
              <Text
                className={`text-base ${
                  isDark ? "text-gray-300" : "text-gray-500"
                }`}>
                {translations.home.search}
              </Text>
            </View>
            <View>
              <Ionicons
                name="chevron-forward-outline"
                size={24}
                color={isDark ? "#fff" : "#4B5563"}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/* 第二个 View - 净资产 */}
        <View
          className={`mt-6 p-4 flex flex-row justify-between gap-2 rounded-lg ${
            isDark ? "bg-primary" : "bg-gray-100"
          }`}>
          {/* Net Worth View */}
          <View className="p-4 rounded-3xl border border-gray-300">
            <Text
              className={`${
                isDark ? "text-white" : ""
              } text-base font-bold text-gray-700`}>
              {translations.home.monthlyIncome}
            </Text>
            <Text className="text-2xl font-extrabold text-green-500">
              ${monthlyIncome.toFixed(2)}
            </Text>
          </View>

          {/* Loss View */}
          <View className="p-4 rounded-3xl border border-gray-300">
            <Text
              className={`${
                isDark ? "text-white" : ""
              } text-base font-bold text-gray-700`}>
              {translations.home.monthlyExpense}
            </Text>
            <Text className="text-2xl font-extrabold text-red-500">
              ${monthlyExpense.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* 第三个 View - 本月支出 */}
        <View
          className={`mt-6 p-6 rounded-2xl ${
            isDark ? "bg-secondary" : "bg-blue-100"
          }`}>
          <Text className="text-2xl font-bold text-gray-700">
            {translations.home.monthlyNetIncome}
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
