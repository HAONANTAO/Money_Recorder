import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";
import RecordShowBox from "@/components/RecordShowbox";

import DateChecker from "@/utils/dateChecker";

const Stats = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 初始化加载状态为 true

  const [income, setIncome] = useState<number>(0); // 收入总和
  const [expense, setExpense] = useState<number>(0); // 支出总和
  const [eventLength, setEventLength] = useState<number>(0); // 净资产

  useEffect(() => {
    const getInit = async () => {
      try {
        const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
        if (!email) return;

        const userData = await getUserByEmail(email);
        // 一起完成
        const [user, records] = await Promise.all([
          getUserByEmail(email),
          getRecords(userData.$id),
        ]);

        setUser(user);

        // 检查必须要是这个月的
        const filteredRecords = DateChecker(
          records as unknown as MoneyRecord[],
        );

        setRecords(filteredRecords);
        setEventLength(records.length);
        // 计算收入和支出
        const incomeTotal = filteredRecords
          .filter((record: any) => record.type === "income")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        const expenseTotal = filteredRecords
          .filter((record: any) => record.type === "expense")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        setIncome(incomeTotal); // 设置收入总和
        setExpense(expenseTotal); // 设置支出总和

        setLoading(false); // 数据加载完成后设置加载状态为 false
      } catch (error) {
        console.error("Error fetching user or records:", error);
        setLoading(false); // 即使出错，也应该停止加载状态
      }
    };

    getInit();
  }, []);

  return (
    <>
      <View
        className={`flex-1 justify-start items-center ${
          theme === "dark" ? "bg-quaternary" : "bg-white"
        }`}>
        {/* title */}
        <Text className="mt-20 text-4xl font-bold text-primary">
          Stats Overview
        </Text>

        {/* 显示加载器 */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          // 数据加载完成后显示记录
          <>
            <View className="p-4">
              <Text className="text-xl font-semibold">
                Total Event: {eventLength}
              </Text>
              <Text className="text-xl font-semibold">
                Total Income: ${income}
              </Text>
              <Text className="text-xl font-semibold">
                Total Expense: ${expense}
              </Text>
            </View>
            {/* diagram */}
            <View></View>
            {/* 东西多的时候可以滚动看 */}
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 20,
                paddingTop: 90, // 增加顶部空白
              }}
              className="p-4 mt-4">
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
            </ScrollView>
          </>
        )}
      </View>
    </>
  );
};

export default Stats;

const styles = StyleSheet.create({});
