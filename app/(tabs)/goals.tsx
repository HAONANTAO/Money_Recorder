import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import DepositBox from "../../components/DepositBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getDeposits } from "@/services/depositGoal";
import { Ionicons } from "@expo/vector-icons";

const Goals = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [deposits, setDeposits] = useState<any>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getInitInfo = async () => {
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      const userData = await getUserByEmail(email);
      const deposit = await getDeposits(userData.$id);
      setDeposits(deposit);
      setUserId(userData.$id);
    };
    getInitInfo();
  }, []);

  return (
    <View
      className={`flex-1 mt-20 items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <Text className="font-extrabold text-secondary">存款目标</Text>
      <DepositBox />

      {/* 添加目标按钮 */}
      <TouchableOpacity
        onPress={() => router.push("/(func)/depositGoal")}
        className={`absolute bottom-8 right-8 p-4 rounded-full shadow-lg ${
          theme === "dark" ? "bg-blue-600" : "bg-blue-500"
        }`}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({});
