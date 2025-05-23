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
import { decreaseSaveAmount, getDeposits } from "@/services/depositGoal";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDeposit, completeDeposit } from "@/services/depositGoal";
import { updateSaveAmount } from "@/services/depositGoal";
import { useLanguage } from "../contexts/LanguageContext";

interface DepositBoxProps {
  demoData?: {
    goalName: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    description: string;
  }[];
}

const DepositBox: React.FC<DepositBoxProps> = ({ demoData }) => {
  const router = useRouter();
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const isDark = theme === "dark";
  const [userId, setUserId] = useState("");
  const [deposits, setDeposits] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);

  const { refresh } = useLocalSearchParams();

  useEffect(() => {
    const getInitInfo = async () => {
      try {
        if (demoData) {
          const formattedDemoData = demoData.map((goal) => ({
            Name: goal.goalName,
            amount: goal.targetAmount,
            startYear: new Date().getFullYear(),
            startMonth: new Date().getMonth() + 1,
            endYear: new Date(goal.deadline).getFullYear(),
            endMonth: new Date(goal.deadline).getMonth() + 1,
            completed: false,
          }));
          setDeposits(formattedDemoData);
          setLoading(false);
          return;
        }

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
  }, [refresh, demoData]); // 添加refresh依赖，当refresh变化时重新加载数据

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  const filteredDeposits = deposits.filter(
    (deposit: any) => deposit.completed === showCompleted,
  );

  return (
    <ScrollView className="flex-1" style={{ width: "80%" }}>
      <View className="relative p-4 w-full">
        {/* 2 top clickable button */}
        <View className="flex-row mb-4 space-x-2">
          <TouchableOpacity
            onPress={() => setShowCompleted(false)}
            className={`flex-1 p-3 rounded-xl  ${
              !showCompleted ? "bg-blue-500" : "bg-gray-300"
            }`}>
            <Text
              className={`text-center font-medium  ${
                !showCompleted ? "text-white" : "text-gray-300"
              }`}>
              {translations.common.uncompleted}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowCompleted(true)}
            className={`flex-1 p-3 rounded-xl text-white ${
              showCompleted ? "bg-blue-500" : "bg-gray-300"
            }`}>
            <Text
              className={`text-center font-medium ${
                showCompleted ? "text-white" : "text-gray-300"
              }`}>
              {translations.common.completed}
            </Text>
          </TouchableOpacity>
        </View>

        {/* main body */}
        {filteredDeposits.map((deposit: any, index: number) => (
          <View
            key={index}
            className={`p-6 mb-5 rounded-3xl shadow-2xl w-full ${
              isDark
                ? "bg-gradient-to-br from-gray-800/95 via-gray-800/90 to-gray-800/85"
                : "bg-gradient-to-br from-white via-blue-50 to-cyan-100"
            } border ${isDark ? "border-blue-900/20" : "border-blue-200/40"}`}
            style={{
              shadowColor: isDark ? "#1e293b" : "#0891b2",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 10,
            }}>
            <View className="flex-row justify-between items-center mb-5">
              {/* name */}
              <View className="flex-row justify-center items-center">
                <Text
                  className={`text-2xl font-bold ${
                    isDark ? "text-white" : "text-secondary"
                  }`}>
                  {deposit.Name}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center mb-4">
              <View
                className={`p-2.5 rounded-2xl ${
                  isDark
                    ? "bg-gradient-to-br from-blue-900/40 to-blue-900/20"
                    : "bg-gradient-to-br from-blue-100 to-blue-50"
                }`}>
                <Ionicons
                  name="wallet-outline"
                  size={32}
                  color={isDark ? "#60a5fa" : "#2563eb"}
                />
              </View>
              <Text
                className={`text-3xl font-bold ml-4 ${
                  isDark ? "text-white" : "text-blue-600"
                }`}>
                ${deposit.amount}
              </Text>
            </View>

            <View className="space-y-4">
              <View className="flex-row items-center">
                <View
                  className={`p-2 rounded-lg mr-3 ${
                    isDark
                      ? "bg-gradient-to-br from-gray-700/60 to-gray-700/40"
                      : "bg-gradient-to-br from-gray-100 to-gray-50"
                  }`}>
                  <Ionicons
                    name="calendar-outline"
                    size={22}
                    color={isDark ? "#9ca3af" : "#4b5563"}
                  />
                </View>
                <Text
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } text-base font-medium`}>
                  {deposit.startYear}.{deposit.startMonth} - {deposit.endYear}.
                  {deposit.endMonth}
                </Text>
              </View>
              <View className="flex-row items-center">
                <View
                  className={`p-2 rounded-lg mr-3 ${
                    isDark
                      ? "bg-gradient-to-br from-gray-700/60 to-gray-700/40"
                      : "bg-gradient-to-br from-gray-100 to-gray-50"
                  }`}>
                  <Ionicons
                    name="cash-outline"
                    size={22}
                    color={isDark ? "#9ca3af" : "#4b5563"}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } text-base font-medium mb-2`}>
                    Deposited : ${deposit.saveAmount || 0}
                    <Text
                      className={`ml-2 ${
                        Number(deposit.saveAmount || 0) / deposit.amount >= 0.7
                          ? "text-green-500"
                          : "text-gray-200"
                      } ${
                        Number(deposit.saveAmount || 0) / deposit.amount >= 0.5
                          ? "text-green-100"
                          : "text-gray-400"
                      }
                      ${
                        Number(deposit.saveAmount || 0) / deposit.amount <= 0.2
                          ? "text-gray-600"
                          : "text-gray-800"
                      }`}>
                      (
                      {(
                        (Number(deposit.saveAmount || 0) / deposit.amount) *
                        100
                      ).toFixed(1)}
                      %)
                    </Text>
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View
                  className={`p-2 rounded-lg mr-3 ${
                    isDark
                      ? "bg-gradient-to-br from-gray-700/60 to-gray-700/40"
                      : "bg-gradient-to-br from-gray-100 to-gray-50"
                  }`}>
                  <Ionicons
                    name="pricetag-outline"
                    size={22}
                    color={isDark ? "#9ca3af" : "#4b5563"}
                  />
                </View>
                {/* category */}
                <Text
                  className={`${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } text-base font-medium`}>
                  {deposit.category}
                </Text>
              </View>
              {deposit.note && (
                <View className="flex-row items-center">
                  <View
                    className={`p-2 rounded-lg mr-3 ${
                      isDark
                        ? "bg-gradient-to-br from-gray-700/60 to-gray-700/40"
                        : "bg-gradient-to-br from-gray-100 to-gray-50"
                    }`}>
                    <Ionicons
                      name="document-text-outline"
                      size={22}
                      color={isDark ? "#9ca3af" : "#4b5563"}
                    />
                  </View>
                  <Text
                    className={`${
                      isDark ? "text-gray-400" : "text-secondary"
                    } text-base italic font-bold`}>
                    {deposit.note}
                  </Text>
                </View>
              )}
            </View>

            {/* buttons */}
            <View className="flex flex-row justify-around px-2 mt-6">
              {/* left buttons group */}
              <View className="flex-row space-x-4">
                {/* update */}
                <TouchableOpacity
                  className={`flex-row items-center justify-center rounded-xl transform active:scale-95 transition-all`}
                  onPress={() =>
                    router.push({
                      pathname: "/(func)/depositGoal",
                      params: { depositId: deposit.$id },
                    })
                  }>
                  <Ionicons
                    name="pencil-outline"
                    size={22}
                    color={isDark ? "#60a5fa" : "#2563eb"}
                  />
                </TouchableOpacity>

                {/* complete button */}
                <TouchableOpacity
                  className={`flex-row items-center justify-center px-3 py-3.5 rounded-xl transform active:scale-95 transition-all`}
                  onPress={async () => {
                    if (deposit.completed) return; // Prevent click if already completed
                    Alert.alert(
                      "Confirmation of completion",
                      "Are you sure you want to mark this deposit goal as completed?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "OK",
                          onPress: async () => {
                            try {
                              const updatedDeposit = await completeDeposit(
                                deposit.$id,
                              );
                              setDeposits(
                                deposits.map((d: any) =>
                                  d.$id === deposit.$id
                                    ? {
                                        ...d,
                                        completed: updatedDeposit.completed,
                                      }
                                    : d,
                                ),
                              );
                              Alert.alert(
                                "Congratulations!",
                                "You have reached your deposit goal!",
                              );
                            } catch (error) {
                              console.error("Error completing deposit:", error);
                              Alert.alert(
                                "Error",
                                "Failed to complete deposit, please try again",
                              );
                            }
                          },
                        },
                      ],
                    );
                  }}
                  disabled={deposit.completed} // Disable button if completed
                >
                  <Ionicons
                    name={
                      deposit.completed
                        ? "checkmark-circle"
                        : "checkmark-circle-outline"
                    }
                    size={22}
                    color={
                      deposit.completed
                        ? isDark
                          ? "#4ade80"
                          : "#16a34a"
                        : isDark
                        ? "#c1d2e7"
                        : "#2563eb"
                    }
                  />
                </TouchableOpacity>

                {/* delete */}
                <TouchableOpacity
                  className={`flex-row items-center justify-center px-3 py-3.5 rounded-xl transform active:scale-95 transition-all`}
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
                  <Ionicons name="trash-outline" size={22} color={"#dc2626"} />
                </TouchableOpacity>
              </View>
              {/* right buttons group */}
              <View className="relative left-9 flex-row space-x-4">
                {/* + */}
                <TouchableOpacity
                  className={`ml-4 px-4 py-2 rounded-full shadow-lg transform active:scale-95 transition-all ${
                    theme === "dark" ? "bg-blue-600/20" : "bg-blue-100"
                  }`}
                  onPress={() => {
                    Alert.prompt(
                      "add money",
                      "How much money you want to add ",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Ok",
                          onPress: async (value) => {
                            if (!value) return;
                            const amount = Number(value);
                            if (isNaN(amount) || amount <= 0) {
                              Alert.alert(
                                "Error",
                                "Please enter a valid amount",
                              );
                              return;
                            }
                            const newAmount =
                              Number(deposit.saveAmount || 0) + amount;
                            try {
                              await updateSaveAmount(deposit.$id, newAmount);
                              setDeposits(
                                deposits.map((d: any) =>
                                  d.$id === deposit.$id
                                    ? { ...d, saveAmount: newAmount }
                                    : d,
                                ),
                              );
                              // 检查是否达到存款目标
                              if (newAmount >= deposit.amount) {
                                Alert.alert(
                                  "Congratulations!",
                                  "You have reached your deposit goal!",
                                  [
                                    {
                                      text: "OK",
                                      onPress: async () => {
                                        try {
                                          const updatedDeposit =
                                            await completeDeposit(deposit.$id);
                                          setDeposits(
                                            deposits.map((d: any) =>
                                              d.$id === deposit.$id
                                                ? {
                                                    ...d,
                                                    completed:
                                                      updatedDeposit.completed,
                                                  }
                                                : d,
                                            ),
                                          );
                                        } catch (error) {
                                          console.error(
                                            "Error completing deposit:",
                                            error,
                                          );
                                        }
                                      },
                                    },
                                  ],
                                );
                              }
                            } catch (error) {
                              console.error(
                                "Error updating save amount:",
                                error,
                              );
                              Alert.alert(
                                "Error",
                                "Failed to update save amount",
                              );
                            }
                          },
                        },
                      ],
                      "plain-text",
                      "",
                      "number-pad",
                    );
                  }}>
                  <Text
                    className={`font-extrabold text-2xl ${"text-green-500"}`}>
                    +
                  </Text>
                </TouchableOpacity>
                {/* - */}
                <TouchableOpacity
                  className={`ml-4 px-4 py-2 rounded-full shadow-lg transform active:scale-95 transition-all ${
                    isDark ? "bg-red-600/20" : "bg-red-100"
                  }`}
                  onPress={() => {
                    Alert.prompt(
                      "decrease money",
                      "How much money you want to decrease ",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Ok",
                          onPress: async (value) => {
                            if (!value) return;
                            const amount = Number(value);
                            if (isNaN(amount) || amount <= 0) {
                              Alert.alert(
                                "Error",
                                "Please enter a valid amount",
                              );
                              return;
                            }
                            const currentSaveAmount = Number(
                              deposit.saveAmount || 0,
                            );
                            if (amount > currentSaveAmount) {
                              Alert.alert(
                                "hint",
                                "The reduction amount cannot be greater than the deposited amount",
                              );
                              return;
                            }
                            try {
                              await decreaseSaveAmount(deposit.$id, amount);
                              const newAmount = currentSaveAmount - amount;
                              setDeposits(
                                deposits.map((d: any) =>
                                  d.$id === deposit.$id
                                    ? { ...d, saveAmount: newAmount }
                                    : d,
                                ),
                              );
                            } catch (error) {
                              console.error(
                                "Error decreasing save amount:",
                                error,
                              );
                              Alert.alert(
                                "Error",
                                "Failed to decrease save amount",
                              );
                            }
                          },
                        },
                      ],
                      "plain-text",
                      "",
                      "number-pad",
                    );
                  }}>
                  {/* decrease */}
                  <Text className={`font-extrabold text-3xl ${"text-red-500"}`}>
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {filteredDeposits.length === 0 && (
          <View
            className={`p-8 rounded-3xl w-full  mx-auto ${
              isDark
                ? "bg-gradient-to-br from-gray-800 to-gray-800/90"
                : "bg-gradient-to-br from-white to-gray-50"
            } shadow-xl items-center justify-center border ${
              theme === "dark" ? "border-gray-700/30" : "border-gray-200/50"
            }`}
            style={{
              shadowColor: isDark ? "#1e293b" : "#94a3b8",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 8,
            }}>
            <View
              className={`p-4 rounded-2xl mb-4 ${
                isDark
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
                isDark ? "text-gray-200" : "text-gray-500"
              }`}>
              {showCompleted
                ? translations.goals.noCompletedData
                : translations.goals.noUnCompletedData}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DepositBox;
