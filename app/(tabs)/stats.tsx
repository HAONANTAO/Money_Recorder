import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";
import RecordShowBox from "@/components/RecordShowbox";

const Stats = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 初始化加载状态为 true

  const [income, setIncome] = useState<number>(0); // 收入总和
  const [expense, setExpense] = useState<number>(0); // 支出总和

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
        setRecords(records);
        // 计算收入和支出
        const incomeTotal = records
          .filter((record: any) => record.type === "income")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        const expenseTotal = records
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
        className={`flex-1 justify-center items-center ${
          theme === "dark" ? "bg-quaternary" : "bg-white"
        }`}>
        {/* title */}
        <Text className="absolute top-24 text-4xl font-bold text-primary">
          Stats Overview
        </Text>

        {/* display the chart */}

        {/* 显示加载器 */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          // 数据加载完成后显示记录
          <>
            <View className="p-4">
              <Text className="text-xl font-semibold">
                Total Income: ${income}
              </Text>
              <Text className="text-xl font-semibold">
                Total Expense: ${expense}
              </Text>
            </View>
            <View className="flex flex-row flex-wrap justify-around">
              {records.length > 0 ? (
                records.map((record: any) => (
                  // solved: 大小box不一致
                  <View className="p-2 w-1/2" key={record.$id}>
                    <RecordShowBox record={record} />
                  </View>
                ))
              ) : (
                <Text>No records found</Text>
              )}
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default Stats;

const styles = StyleSheet.create({});
