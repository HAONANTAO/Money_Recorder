import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const isDark = theme === "dark";
  const { translations } = useLanguage();
  const { depositId } = useLocalSearchParams();

  const { language } = useLanguage();
  const currentDepositCategory =
    language === "zh" ? DEPOSIT_CATEGORIES2 : DEPOSIT_CATEGORIES;

  const [category, setCategory] = useState(
    currentDepositCategory[0]?.value || "",
  );
  // 预算类别
  const [note, setNote] = useState(""); // 备注
  const [userId, setUserId] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
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
            setStartDate(
              new Date(depositData.startYear, depositData.startMonth - 1),
            );
            setEndDate(new Date(depositData.endYear, depositData.endMonth - 1));
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

  const handleDepositSubmit = async (goal: string, amount: string) => {
    if (!amount) {
      alert(translations.goals.depositGoal.enterAmount);
      return;
    }

    // 验证结束日期不早于开始日期
    if (endDate < startDate) {
      alert(translations.goals.depositGoal.endDateError);
      return;
    }

    const depositData = {
      userId: userId,
      amount: parseFloat(amount),
      Name: name,
      startYear: startDate.getFullYear(),
      startMonth: startDate.getMonth() + 1,
      endYear: endDate.getFullYear(),
      endMonth: endDate.getMonth() + 1,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          setShowStartDatePicker(false);
          setShowEndDatePicker(false);
        }}>
        <View className={`flex-1 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
          <BackButton />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: "center",
              paddingBottom: 20,
            }}
            keyboardShouldPersistTaps="handled">
            <Text
              className={`mt-20 text-xl font-extrabold text-secondary ${
                isDark ? "text-white" : "text-secondary"
              }`}>
              {translations.goals.depositGoal.title}
            </Text>
            <View className="mt-6 w-80">
              <Text
                className={`mt-4 mb-2 text-base font-bold ${
                  isDark ? "text-white" : ""
                }`}>
                {translations.goals.depositGoal.name}
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={translations.goals.depositGoal.namePlaceholder}
                className={`p-4 rounded-lg border  ${
                  isDark ? "border-black text-white " : "border-gray-300"
                }`}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              <Text
                className={`mt-4 mb-2 text-base font-bold ${
                  isDark ? "text-white" : ""
                }`}>
                {translations.goals.depositGoal.amount}
              </Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder={translations.goals.depositGoal.amountPlaceholder}
                keyboardType="numeric"
                className={`p-4 rounded-lg border  ${
                  isDark ? "border-black text-white " : "border-gray-300"
                }`}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              {/* category */}
              <View
                className={`mb-4 mt-4 ${
                  isDark ? "bg-transparent border border-black " : "bg-white "
                } rounded-xl p-4`}>
                <Text
                  className={`mb-2 text-base font-bold ${
                    isDark ? "text-gray-200" : "text-gray-700"
                  }`}>
                  {translations.goals.depositGoal.category}
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {currentDepositCategory.map((cat) => (
                    <TouchableOpacity
                      key={cat.value}
                      onPress={() => setCategory(cat.value)}
                      className={`p-3 rounded-lg flex-grow ${
                        isDark ? "border border-white" : ""
                      } ${
                        category === cat.value
                          ? isDark
                            ? "bg-blue-700"
                            : "bg-blue-500"
                          : isDark
                          ? "bg-gray-700"
                          : "bg-gray-200"
                      }`}>
                      <Text
                        className={`text-center font-medium ${
                          category === cat.value
                            ? "text-white"
                            : isDark
                            ? "text-gray-200"
                            : "text-gray-700"
                        }`}>
                        {`${cat.icon} ${cat.label}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/*comment  */}
              <Text
                className={`mb-2 text-base font-bold ${
                  isDark ? "text-white" : ""
                }`}>
                {translations.goals.comment}
              </Text>

              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={translations.goals.depositGoal.notePlaceholder}
                className={`p-4 rounded-lg border  ${
                  isDark ? "border-black text-white " : "border-gray-300"
                }`}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
              <View className="flex-row mt-4 space-x-4">
                <View className="flex-1">
                  <Text
                    className={`mb-2 text-base font-bold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>
                    {translations.goals.depositGoal.startDate}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      setShowStartDatePicker(true);
                      setShowEndDatePicker(false);
                    }}
                    className={`p-3 border rounded-md ${
                      isDark
                        ? "border-gray-600 bg-tertiary"
                        : "border-gray-300 bg-white"
                    }`}>
                    <Text className={"text-black"}>
                      {`${startDate.getFullYear()}/${startDate.getMonth() + 1}`}
                    </Text>
                  </TouchableOpacity>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="default" // iOS弹窗效果，Android默认也OK
                      themeVariant={isDark ? "dark" : "light"}
                      onChange={(event, selectedDate) => {
                        if (event.type === "set" && selectedDate) {
                          setStartDate(selectedDate);
                        }
                        setShowStartDatePicker(false); // 无论确定或取消，都关闭弹窗
                      }}
                    />
                  )}
                </View>

                <View className="flex-1">
                  <Text
                    className={`mb-2 text-base font-bold ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}>
                    {translations.goals.depositGoal.endDate}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowEndDatePicker(true);
                      setShowStartDatePicker(false);
                    }}
                    className={`p-3 border rounded-md ${
                      isDark
                        ? "border-gray-600 bg-tertiary"
                        : "border-gray-300 bg-white"
                    }`}>
                    <Text className={"text-black"}>
                      {`${endDate.getFullYear()}/${endDate.getMonth() + 1}`}
                    </Text>
                  </TouchableOpacity>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display="default"
                      themeVariant={isDark ? "dark" : "light"}
                      onChange={(event, selectedDate) => {
                        if (event.type === "set" && selectedDate) {
                          setEndDate(selectedDate);
                        }
                        setShowEndDatePicker(false);
                      }}
                    />
                  )}
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
    </KeyboardAvoidingView>
  );
};

export default DepositGoal;
