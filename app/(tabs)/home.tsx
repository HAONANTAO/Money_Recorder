/*
 * @Date: 2025-03-21 21:26:12
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-28 18:35:12
 * @FilePath: /Money_Recorder/app/(tabs)/home.tsx
 */
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { center } from "../../node_modules/@shopify/react-native-skia/lib/module/skia/core/Rect";
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

  useEffect(() => {
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
        const filteredRecords = DateChecker(
          records as unknown as MoneyRecord[],
        );
        setRecords(filteredRecords);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user or records:", error);
        setLoading(false);
      }
    };

    getInit();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
              Net Worth
            </Text>
            <Text className="text-4xl font-extrabold text-green-500">
              $12,500
            </Text>
          </View>

          {/* Loss View */}
          <View className="p-4 rounded-3xl border border-gray-300 dark:border-gray-700">
            <Text
              className={`${
                isDark ? "text-white" : ""
              } text-xl font-bold text-gray-700`}>
              Loss
            </Text>
            <Text className="text-4xl font-extrabold text-red-500">$2,300</Text>
          </View>
        </View>

        {/* 第三个 View - 本月支出 */}
        <View
          className={`mt-6 p-6 rounded-2xl ${
            isDark ? "bg-secondary" : "bg-blue-100"
          }`}>
          <Text className="text-lg font-bold text-gray-700 dark:text-white">
            This Month's Expenses
          </Text>
          <Text className="text-5xl font-extrabold text-red-500">$1,200</Text>
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
