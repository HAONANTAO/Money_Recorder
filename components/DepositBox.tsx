import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getDeposits } from "@/services/depositGoal";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDeposit } from "@/services/depositGoal";

const DepositBox = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState();
  const [userId, setUserId] = useState("");
  const [deposits, setDeposits] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const { refresh } = useLocalSearchParams();

  useEffect(() => {
    const getInitInfo = async () => {
      try {
        const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
        if (!email) return;

        const userData = await getUserByEmail(email);
        const deposit = await getDeposits(userData.$id);
        setUserId(userData.$id);
        setDeposits(deposit);
      } catch (error) {
        console.error("Failed to obtain data:", error);
      } finally {
        setLoading(false);
      }
    };
    getInitInfo();
  }, [refresh]); // 添加refresh依赖，当refresh变化时重新加载数据

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1">
      <View className="p-4 w-full">
        {deposits.map((deposit: any, index: number) => (
          <View
            key={index}
            className={`p-6 mb-5 rounded-3xl shadow-2xl ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-800/95 via-gray-800/90 to-gray-800/85"
                : "bg-gradient-to-br from-white via-blue-50 to-cyan-100"
            } border ${
              theme === "dark" ? "border-blue-900/20" : "border-blue-200/40"
            }`}
            style={{
              shadowColor: theme === "dark" ? "#1e293b" : "#0891b2",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 10,
            }}>
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center">
                <View
                  className={`p-2.5 rounded-2xl ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-blue-900/40 to-blue-900/20"
                      : "bg-gradient-to-br from-blue-100 to-blue-50"
                  }`}>
                  <Ionicons
                    name="wallet-outline"
                    size={32}
                    color={theme === "dark" ? "#60a5fa" : "#2563eb"}
                  />
                </View>
                <Text
                  className={`text-4xl font-bold ml-4 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}>
                  ¥{deposit.amount}
                </Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <View
                  className={`p-2.5 rounded-xl ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-blue-900/40 to-blue-900/20"
                      : "bg-gradient-to-br from-blue-100 to-blue-50"
                  }`}>
                  {new Date(`${deposit.endYear}-${deposit.endMonth}-01`) <
                  new Date() ? (
                    <View className="p-2">
                      <Text style={{ color: "#ef4444", fontSize: 20 }}>
                        Expired
                      </Text>
                    </View>
                  ) : (
                    <Ionicons
                      name="trending-up"
                      size={26}
                      color={theme === "dark" ? "#60a5fa" : "#2563eb"}
                    />
                  )}
                </View>
              </View>
            </View>
            <View className="space-y-4">
              <View className="flex-row items-center">
                <View
                  className={`p-2 rounded-lg mr-3 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-gray-700/60 to-gray-700/40"
                      : "bg-gradient-to-br from-gray-100 to-gray-50"
                  }`}>
                  <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={theme === "dark" ? "#9ca3af" : "#4b5563"}
                  />
                </View>
                <Text
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } text-base font-medium`}>
                  {deposit.startYear}.{deposit.startMonth} - {deposit.endYear}.
                  {deposit.endMonth}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View
                  className={`p-2 rounded-lg mr-3 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-gray-700/60 to-gray-700/40"
                      : "bg-gradient-to-br from-gray-100 to-gray-50"
                  }`}>
                  <Ionicons
                    name="pricetag-outline"
                    size={22}
                    color={theme === "dark" ? "#9ca3af" : "#4b5563"}
                  />
                </View>
                <Text
                  className={`${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  } text-base font-medium`}>
                  {deposit.category}
                </Text>
              </View>
              {deposit.note && (
                <View className="flex-row items-center">
                  <View
                    className={`p-2 rounded-lg mr-3 ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-gray-700/60 to-gray-700/40"
                        : "bg-gradient-to-br from-gray-100 to-gray-50"
                    }`}>
                    <Ionicons
                      name="document-text-outline"
                      size={22}
                      color={theme === "dark" ? "#9ca3af" : "#4b5563"}
                    />
                  </View>
                  <Text
                    className={`${
                      theme === "dark" ? "text-gray-400" : "text-secondary"
                    } text-base italic font-bold`}>
                    {deposit.note}
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-row justify-end mt-4 space-x-3">
              <TouchableOpacity
                className={`flex-row items-center px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-blue-600/20" : "bg-blue-100"
                }`}
                onPress={() =>
                  router.push({
                    pathname: "/(func)/depositGoal",
                    params: { depositId: deposit.$id },
                  })
                }>
                <Ionicons
                  name="pencil-outline"
                  size={20}
                  color={theme === "dark" ? "#60a5fa" : "#2563eb"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}>
                  Update
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-row items-center px-4 py-2 rounded-lg ${
                  theme === "dark" ? "bg-red-600/20" : "bg-red-100"
                }`}
                onPress={() => {
                  Alert.alert(
                    "Confirm Delete",
                    "Are you sure you want to delete this deposit target?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                          try {
                            await deleteDeposit(deposit.$id);
                            setDeposits(
                              deposits.filter(
                                (d: { $id: any }) => d.$id !== deposit.$id,
                              ),
                            );
                          } catch (error) {
                            console.error("Deletion failed:", error);
                            Alert.alert(
                              "Error",
                              "Deletion failed, please try again",
                            );
                          }
                        },
                      },
                    ],
                  );
                }}>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={theme === "dark" ? "#f87171" : "#dc2626"}
                />
                <Text
                  className={`ml-2 font-medium ${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  }`}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {deposits.length === 0 && (
          <View
            className={`p-8 rounded-3xl ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-800 to-gray-800/90"
                : "bg-gradient-to-br from-white to-gray-50"
            } shadow-xl items-center justify-center border ${
              theme === "dark" ? "border-gray-700/30" : "border-gray-200/50"
            }`}
            style={{
              shadowColor: theme === "dark" ? "#1e293b" : "#94a3b8",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}>
            <View
              className={`p-4 rounded-2xl mb-4 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-gray-700/60 to-gray-700/40"
                  : "bg-gradient-to-br from-gray-100 to-gray-50"
              }`}>
              <Ionicons
                name="wallet-outline"
                size={44}
                color={theme === "dark" ? "#4b5563" : "#6b7280"}
              />
            </View>
            <Text
              className={`text-lg font-medium ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
              No deposit goal yet
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DepositBox;

const styles = StyleSheet.create({});
