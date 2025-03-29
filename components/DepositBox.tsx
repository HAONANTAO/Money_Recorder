import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getDeposits } from "@/services/depositGoal";
const DepositBox = () => {
  const [user, setUser] = useState();
  const [userId, setUserId] = useState("");
  const [deposits, setDeposits] = useState<any>([]);
  // 获取数据
  useEffect(() => {
    const getInitInfo = async () => {
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      const userData = await getUserByEmail(email);
      const deposit = await getDeposits(userData.$id);
      setUserId(userData.$id);
      setDeposits(deposit);
    };
    getInitInfo();
  }, []);

  // 打印测试
  useEffect(() => {
    if (userId && deposits.length > 0) {
      console.log("用户ID:", userId);
      console.log("存款目标:", deposits);
    }
  }, [userId, deposits]);

  return (
    <View className="p-4 w-full">
      {deposits.map((deposit: any, index: number) => (
        <View key={index} className="p-4 mb-4 bg-white rounded-lg shadow-md">
          <Text className="mb-2 text-lg font-bold text-secondary">
            目标金额: ¥{deposit.amount}
          </Text>
          <Text className="mb-1 text-gray-600">
            时间范围: {deposit.startYear}年{deposit.startMonth}月 -{" "}
            {deposit.endYear}年{deposit.endMonth}月
          </Text>
          <Text className="mb-1 text-gray-600">类别: {deposit.category}</Text>
          {deposit.note && (
            <Text className="italic text-gray-500">备注: {deposit.note}</Text>
          )}
        </View>
      ))}
      {deposits.length === 0 && (
        <Text className="text-center text-gray-500">暂无存款目标</Text>
      )}
    </View>
  );
};

export default DepositBox;

const styles = StyleSheet.create({});
