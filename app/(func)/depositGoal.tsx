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
import {
  DEPOSIT_CATEGORIES,
  DEPOSIT_CATEGORIES2,
} from "../../constants/categories";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import BackButton from "@/components/BackButton";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys, StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import {
  createDeposit,
  getDepositById,
  updateDeposit,
} from "@/services/depositGoal";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";

const DepositGoal = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const { depositId } = useLocalSearchParams();
  // const [user, setUser] = useState<any>(null);
  const { language } = useLanguage();
  const currentDepositCategory =
    language === "zh" ? DEPOSIT_CATEGORIES2 : DEPOSIT_CATEGORIES;

  const [category, setCategory] = useState(
    currentDepositCategory[0]?.value || "",
  );
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
      const isGuest = await StorageService.getIsGuest();
      if (isGuest) {
        setUserId("guest");
        return;
      }

      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      const userData = await getUserByEmail(email);
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
  // check
  useEffect(() => {
    console.log(depositId);
  }, []);
  const handleDepositSubmit = async (goal: string, amount: string) => {
    if (!amount) {
      alert(translations.goals.depositGoal.enterAmount);
      return;
    }

    // 验证结束日期不早于开始日期
    const startDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);
    if (endDate < startDate) {
      alert(translations.goals.depositGoal.endDateError);
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
        alert(translations.goals.depositGoal.updateSuccess);
      } else {
        // 创建新的存款目标
        await createDeposit({
          ...depositData,
        });
        alert(translations.goals.depositGoal.createSuccess);
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
          ? translations.goals.depositGoal.updateFailed
          : translations.goals.depositGoal.createFailed,
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        className={`flex-1 ${
          theme === "dark" ? "bg-quaternary" : "bg-gray-100"
        }`}>
        <View className="absolute left-4 top-12 z-50">
          <BackButton />
        </View>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled">
          <Text className="mt-20 text-xl font-extrabold text-secondary">
            {translations.goals.depositGoal.title}
          </Text>
          <View className="mt-6 w-80">
            <Text className="mt-4 mb-2 text-base font-bold">
              {translations.goals.depositGoal.name}
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={translations.goals.depositGoal.namePlaceholder}
              className="p-4 rounded-lg border border-gray-300"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            <Text className="mt-4 mb-2 text-base font-bold">
              {translations.goals.depositGoal.amount}
            </Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder={translations.goals.depositGoal.amountPlaceholder}
              keyboardType="numeric"
              className="p-4 rounded-lg border border-gray-300"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            <View className="overflow-hidden mt-4 rounded-lg border border-gray-300">
              <Text className="mt-2 text-base font-bold">
                {translations.goals.depositGoal.category}
              </Text>
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
                {currentDepositCategory.map((cat) => (
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
              placeholder={translations.goals.depositGoal.notePlaceholder}
              className="p-4 mt-4 rounded-lg border border-gray-300"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
            <View className="flex-row mt-4 space-x-4">
              <View className="flex-1">
                <Text className="mb-2 font-bold">
                  {translations.goals.depositGoal.startDate}
                </Text>
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
                <Text className="mb-2 font-bold">
                  {translations.goals.depositGoal.endDate}
                </Text>
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
            {userId === "guest" && (
              <Text className="mt-4 mb-4 text-center text-red-500">
                {translations.guestmode.depositgoal}
              </Text>
            )}
            <TouchableOpacity
              onPress={() => handleDepositSubmit("Deposit", amount)}
              disabled={userId === "guest"}
              className={`p-4 mt-6 rounded-lg ${
                userId === "guest" ? "bg-gray-400" : "bg-blue-500"
              }`}>
              <Text className="font-semibold text-center text-white">
                {depositId
                  ? translations.goals.depositGoal.updateButton
                  : translations.goals.depositGoal.createButton}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default DepositGoal;
