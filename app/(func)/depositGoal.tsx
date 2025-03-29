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
import DepositBox from "../../components/DepositBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { createDeposit, getDeposits } from "@/services/depositGoal";

const DepositGoal = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [deposits, setDeposits] = useState<any>([]);
  const [emergencyFund, setEmergencyFund] = useState(""); // 紧急基金金额
  const [travelFund, setTravelFund] = useState(""); // 旅行基金金额
  const [category, setCategory] = useState(""); // 预算类别
  const [note, setNote] = useState(""); // 备注
  const [userId, setUserId] = useState("");
  const [startYear, setStartYear] = useState(new Date().getFullYear()); // 起始年份
  const [startMonth, setStartMonth] = useState(new Date().getMonth() + 1); // 起始月份
  const [endYear, setEndYear] = useState(new Date().getFullYear()); // 结束年份
  const [endMonth, setEndMonth] = useState(new Date().getMonth() + 1); // 结束月份
  const [amount, setAmount] = useState(""); // 存款目标金额

  useEffect(() => {
    const getInitInfo = async () => {
      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      const userData = await getUserByEmail(email);
      const [user, deposit] = await Promise.all([
        getUserByEmail(email),
        getDeposits(userData.$id),
      ]);
      setDeposits(deposit);
      setUser(user);
      setUserId(userData.$id);
    };
    getInitInfo();
  }, []);

  const handleDepositSubmit = async (goal: string, amount: string) => {
    if (!amount) {
      alert(`Please enter a value for ${goal}`);
      return;
    }

    const newDeposit: Deposit = {
      userId: userId,
      amount: parseFloat(amount),
      startYear: startYear,
      startMonth: startMonth,
      endYear: endYear,
      endMonth: endMonth,
      createAt: new Date().toISOString(),
      category: category || undefined,
      note: note || "",
      // 不需要手动指定 $id，因为它是由数据库生成的
    };

    try {
      await createDeposit(newDeposit); // 这里将提交给数据库，数据库会为 $id 生成一个值
      alert(`${goal} deposit goal added successfully!`);
      // 清空输入框
      goal === "Emergency Fund" ? setEmergencyFund("") : setTravelFund("");
      setCategory(""); // 清空类别
      setNote(""); // 清空备注
      // 重新获取存款数据
      const updatedDeposits = await getDeposits(userId);
      setDeposits(updatedDeposits);
    } catch (error) {
      console.error("Error adding deposit:", error);
      alert(`Failed to add ${goal} deposit goal.`);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`flex-1 mt-20 items-center ${
          theme === "dark" ? "bg-quaternary" : "bg-gray-100"
        }`}>
        <Text className="font-extrabold text-secondary">The Deposit Goal</Text>
        <DepositBox />

        <View className="mt-6 w-80">
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="请输入存款目标金额"
            keyboardType="numeric"
            className="p-4 rounded-lg border border-gray-300"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <View className="overflow-hidden mt-4 rounded-lg border border-gray-300">
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
            placeholder="添加备注（可选）"
            className="p-4 mt-4 rounded-lg border border-gray-300"
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <View className="flex-row mt-4 space-x-4">
            <View className="flex-1">
              <Text className="mb-2">开始日期</Text>
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
              <Text className="mb-2">结束日期</Text>
              <View className="overflow-hidden rounded-lg border border-gray-300">
                <Picker
                  selectedValue={endYear.toString()}
                  onValueChange={(itemValue) => setEndYear(parseInt(itemValue))}
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
              Create Deposit Goal
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DepositGoal;

const styles = StyleSheet.create({});
