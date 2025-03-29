import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { DEPOSIT_CATEGORIES } from "../../constants/categories";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import {
  createDeposit,
  getDeposits,
  getDepositById,
  updateDeposit,
} from "@/services/depositGoal";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

const DepositGoal = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { depositId } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);

  const [category, setCategory] = useState(DEPOSIT_CATEGORIES[0]?.value || "");
  // 预算类别
  const [note, setNote] = useState(""); // 备注
  const [userId, setUserId] = useState("");
  const [startYear, setStartYear] = useState(new Date().getFullYear()); // 起始年份
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1); // 起始月份
  const [endYear, setEndYear] = useState(new Date().getFullYear()); // 结束年份
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1); // 结束月份
  const [amount, setAmount] = useState(""); // 存款目标金额
  const [name, setName] = useState(""); // 存款名称

  useEffect(() => {
    const getInitInfo = async () => {
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      const userData = await getUserByEmail(email);
      setUser(user);
      setUserId(userData.$id);

      if (depositId) {
        try {
          const depositData = await getDepositById(depositId as string);
          if (depositData) {
            setAmount(depositData.amount.toString());
            setCategory(depositData.category || "");
            setNote(depositData.note || "");
            setName(depositData.Name || "");
            setStartYear(depositData.startYear);
            setStartMonth(depositData.startMonth);
            setEndYear(depositData.endYear);
            setEndMonth(depositData.endMonth);
          }
        } catch (error) {
          console.error("获取存款目标数据失败:", error);
          alert("获取存款目标数据失败");
        }
      }
    };
    getInitInfo();
  }, [depositId]);

  const handleDepositSubmit = async (goal: string, amount: string) => {
    if (!amount) {
      alert(`Please enter the deposit amount`);
      return;
    }

    // 验证结束日期不早于开始日期
    const startDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);
    if (endDate < startDate) {
      alert(`End date cannot be earlier than start date`);
      return;
    }

    const depositData = {
      userId: userId,
      amount: parseFloat(amount),
      Name: name,
      startYear: startYear,
      startMonth: startMonth,
      endYear: endYear,
      endMonth: endMonth,
      category: category || undefined,
      note: note || "",
    };

    try {
      if (depositId) {
        // 更新现有存款目标
        await updateDeposit(depositId as string, depositData);
        alert("Deposit target updated successfully!");
      } else {
        // 创建新的存款目标
        await createDeposit({
          ...depositData,
        });
        alert("Deposit target created successfully!");
      }

      // 清空输入框
      setAmount("");
      setCategory("");
      setNote("");

      // 返回上一页并刷新数据
      router.push({
        pathname: "/(tabs)/goals",
        params: { refresh: Date.now().toString() },
      });
    } catch (error) {
      console.error("Operation failed:", error);
      alert(
        depositId
          ? "Update deposit target failed"
          : "Failed to create deposit destination",
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`flex-1 ${
          theme === "dark" ? "bg-quaternary" : "bg-gray-100"
        }`}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled">
          <Text className="mt-20 text-xl font-extrabold text-secondary">
            The Deposit Goal
          </Text>
          <View className="mt-6 w-80">
            <Text className="mt-4 mb-2 text-base font-bold">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Please enter the deposit name..."
              className="p-4 rounded-lg border border-gray-300"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text className="mt-4 mb-2 text-base font-bold">Amount</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="Please enter the deposit amount..."
              keyboardType="numeric"
              className="p-4 rounded-lg border border-gray-300"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            <View className="overflow-hidden mt-4 rounded-lg border border-gray-300">
              <Text className="mt-2 text-base font-bold">Category</Text>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue: string) => setCategory(itemValue)}
                style={{
                  backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  height: 200,
                  marginVertical: 10,
                  paddingHorizontal: 16,
                  width: "100%",
                  borderRadius: 8,
                }}
                itemStyle={{
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                  fontSize: 20,
                  height: 150,
                  textAlign: "center",
                  paddingVertical: 12,
                }}>
                {DEPOSIT_CATEGORIES.map((cat) => (
                  <Picker.Item
                    key={cat.value}
                    label={`${cat.icon} ${cat.label}`}
                    value={cat.value}
                  />
                ))}
              </Picker>
            </View>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add a note"
              className="p-4 mt-4 rounded-lg border border-gray-300"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            <View className="flex-row mt-4 space-x-4">
              <View className="flex-1">
                <Text className="mb-2 font-bold">Start Date</Text>
                <View className="overflow-hidden rounded-lg border border-gray-300">
                  <Picker
                    selectedValue={startYear.toString()}
                    onValueChange={(itemValue) =>
                      setStartYear(parseInt(itemValue))
                    }
                    style={{
                      backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                      height: 100,
                    }}
                    itemStyle={{
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                      fontSize: 16,
                      height: 100,
                    }}>
                    {Array.from({ length: 11 }, (_, i) => (
                      <Picker.Item
                        key={i}
                        label={String(new Date().getFullYear() - 5 + i)}
                        value={String(new Date().getFullYear() - 5 + i)}
                      />
                    ))}
                  </Picker>
                </View>
                <View className="overflow-hidden mt-2 rounded-lg border border-gray-300">
                  <Picker
                    selectedValue={startMonth.toString()}
                    onValueChange={(itemValue) =>
                      setStartMonth(parseInt(itemValue))
                    }
                    style={{
                      backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                      height: 100,
                    }}
                    itemStyle={{
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                      fontSize: 16,
                      height: 100,
                    }}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <Picker.Item
                        key={i}
                        label={String(i + 1)}
                        value={String(i + 1)}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View className="flex-1">
                <Text className="mb-2 font-bold">End Date</Text>
                <View className="overflow-hidden rounded-lg border border-gray-300">
                  <Picker
                    selectedValue={endYear.toString()}
                    onValueChange={(itemValue) =>
                      setEndYear(parseInt(itemValue))
                    }
                    style={{
                      backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                      height: 100,
                    }}
                    itemStyle={{
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                      fontSize: 16,
                      height: 100,
                    }}>
                    {Array.from({ length: 11 }, (_, i) => (
                      <Picker.Item
                        key={i}
                        label={String(new Date().getFullYear() - 5 + i)}
                        value={String(new Date().getFullYear() - 5 + i)}
                      />
                    ))}
                  </Picker>
                </View>
                <View className="overflow-hidden mt-2 rounded-lg border border-gray-300">
                  <Picker
                    selectedValue={endMonth.toString()}
                    onValueChange={(itemValue) =>
                      setEndMonth(parseInt(itemValue))
                    }
                    style={{
                      backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                      height: 100,
                    }}
                    itemStyle={{
                      color: theme === "dark" ? "#FFFFFF" : "#000000",
                      fontSize: 16,
                      height: 100,
                    }}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <Picker.Item
                        key={i}
                        label={String(i + 1)}
                        value={String(i + 1)}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleDepositSubmit("Deposit", amount)}
              className="p-4 mt-6 bg-blue-500 rounded-lg">
              <Text className="font-semibold text-center text-white">
                {depositId ? "Update Deposit Goal" : "Create Deposit Goal"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DepositGoal;

const styles = StyleSheet.create({});
