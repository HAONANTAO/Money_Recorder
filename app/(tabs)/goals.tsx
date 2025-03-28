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
        console.log("fetchDeposits good");
      } catch (error) {
        console.log("fetchDeposits failed", error);
      }
    };
    fetchDeposits();
  }, [deposits]);
  return (
    <View
      className={`flex-1 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <Text>The Deposit Goal</Text>
    </View>
  );
};

export default Goals;

const styles = StyleSheet.create({});
