/*
 * @Date: 2025-03-26 16:50:03
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-26 17:06:55
 * @FilePath: /Money_Recorder/app/(tabs)/stats.tsx
 */
import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";
// import { getRecords } from "../../services/bucketStorageService";
const Stats = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any>(null);
  let email;
  useEffect(() => {
    // email
    const getInit = async () => {
      try {
        const email = await AsyncStorage.getItem(StorageKeys.EMAIL); // 直接获取 email
        if (!email) return;

        // 同时获取 user 和 records
        const userData = await getUserByEmail(email);
        // 用来并行执行多个异步操作，并同时等待它们的结果。
        const [user, records] = await Promise.all([
          getUserByEmail(email),
          getRecords(userData.$id),
        ]);

        setUser(user);
        setRecords(records);
        console.log(records);
      } catch (error) {
        console.error("Error fetching user or records:", error);
      }
    };
    getInit();
  }, []);
  //
  useEffect(() => {
    console.log("Updated user:", user);
  }, [user]); // 只要 user 变化，就会执行这个 useEffect

  return (
    <View
      className={`flex-1 justify-center items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <Text className="text-5xl font-bold text-primary">stats</Text>
    </View>
  );
};

export default Stats;

const styles = StyleSheet.create({});
