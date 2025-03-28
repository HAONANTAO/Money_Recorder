import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import DepositBox from "../../components/DepositBox";

const Goals = () => {
  const router = useRouter();
  const { theme } = useTheme();
  // 刷新的
  const [refreshing, setRefreshing] = useState(false);
  //存goals
  const [deposits, setDeposits] = useState([]);
  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        // console.log("fetchDeposits good");
      } catch (error) {
        console.log("fetchDeposits failed", error);
      }
    };
    fetchDeposits();
  }, [deposits]);
  return (
    <View
      className={`flex-1 mt-20 items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <Text className="font-extrabold text-secondary">The Deposit Goal</Text>
      <DepositBox />
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({});
