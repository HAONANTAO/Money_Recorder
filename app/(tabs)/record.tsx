import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { createRecord } from "../../services/recordService";
import { StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import {
  INCOME_CATEGORIES,
  INCOME_CATEGORIES2,
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORIES2,
} from "@/constants/categories";
import { useLanguage } from "../../contexts/LanguageContext";

const Record = () => {
  const { theme } = useTheme();
  const { translations, language } = useLanguage();
  const isDark = theme === "dark";
  const currentExpenseCategories =
    language === "en" ? EXPENSE_CATEGORIES : EXPENSE_CATEGORIES2;
  const currentIncomeCategories =
    language === "en" ? INCOME_CATEGORIES : INCOME_CATEGORIES2;

  const [record, setRecord] = useState({
    userId: "guest",
    moneyAmount: "",
    // ，'as'是类型断言操作符。这里'expense' as 'income' | 'expense'的作用是告诉TypeScript编译器将'expense'字符串值明确地视为'income'或'expense'联合类型中的一个。
    type: "expense" as "income" | "expense",
    category: "",
    paymentMethod: "",
    tags: "",
    location: "",
    recurring: false,
    comment: "",
  });

  // 获取用户ID
  React.useEffect(() => {
    const getUserId = async () => {
      try {
        const email = await StorageService.getEmail();
        if (email) {
          const userInfo = await getUserByEmail(email);
          setRecord((prev) => ({ ...prev, userId: userInfo.$id }));
        }
      } catch (error) {
        console.error("Get UserID failed:", error);
      }
    };
    getUserId();
  }, []);

  const handleSubmit = async () => {
    try {
      if (record.userId === "guest") {
        alert("请登录后再试");
        return;
      }
      if (!record.moneyAmount || !record.category) {
        alert(translations.alerts.fillAmountCategory);
        return;
      }
      const newRecord = await createRecord({
        ...record,
        moneyAmount: parseFloat(record.moneyAmount),
        tags: record.tags.split(",").filter(Boolean).join(","),
      });
      alert(translations.alerts.createSuccess);
      // 清空表单
      setRecord({
        ...record,
        moneyAmount: "",
        category: "",
        paymentMethod: "",
        tags: "",
        location: "",
        comment: "",
      });
    } catch (error) {
      console.error("failed create record:", error);
      alert(translations.alerts.createError);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className={`flex-1 ${isDark ? "bg-quaternary" : "bg-gray-100"}`}>
        <View className="p-5">
          {record.userId === "guest" ||
            (record.userId === "" && (
              <Text className="mb-4 text-center text-red-500">
                游客模式下无法保存记录，请登录后再试
              </Text>
            ))}
          <Text
            className={`mt-12 text-2xl font-bold mb-5 text-center ${
              isDark ? "text-secondary" : "text-quaternary"
            }`}>
            {translations.record.title}
          </Text>

          {/* 金额输入 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.amount}
            </Text>
            <View className={`flex-row items-center p-3 bg-white rounded-lg`}>
              <Text
                className={`text-xl mr-2 font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                $
              </Text>
              <TextInput
                placeholder={translations.record.amountPlaceholder}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                keyboardType="numeric"
                value={record.moneyAmount}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                onChangeText={(value) =>
                  setRecord({ ...record, moneyAmount: value })
                }
                className="flex-1"
              />
            </View>
          </View>

          {/* 类型选择 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.type}
            </Text>
            <View
              className={`${
                isDark ? "" : "bg-white"
              }overflow-hidden  rounded-lg`}>
              <Picker
                selectedValue={record.type}
                onValueChange={(value) => setRecord({ ...record, type: value })}
                className={`h-12 ${
                  isDark
                    ? "bg-gray-700 text-gray-200"
                    : "bg-white text-gray-800"
                }`}>
                <Picker.Item
                  label={translations.record.expense}
                  value="expense"
                  color={isDark ? "#EF4444" : "#DC2626"}
                />
                <Picker.Item
                  label={translations.record.income}
                  value="income"
                  color={isDark ? "#10B981" : "#059669"}
                />
              </Picker>
            </View>
          </View>

          {/* 类别选择 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.category}
            </Text>
            <View
              className={`${
                isDark ? "" : "bg-white"
              }overflow-hidden  rounded-lg`}>
              <Picker
                selectedValue={record.category}
                onValueChange={(value) =>
                  setRecord({ ...record, category: value })
                }
                className={`h-12 ${
                  isDark
                    ? "bg-gray-700 text-gray-200"
                    : "bg-white text-gray-800"
                }`}>
                <Picker.Item
                  label={translations.record.chooseCategory}
                  value={translations.record.chooseCategory}
                  color={isDark ? "#1e67e5" : "#1c64f3"}
                />
                {(record.type === "expense"
                  ? currentExpenseCategories
                  : currentIncomeCategories
                ).map((category) => (
                  <Picker.Item
                    key={category.value}
                    label={`${category.icon} ${category.label}`}
                    value={category.value}
                    color={isDark ? "#E5E7EB" : "#1F2937"}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* 支付方式 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.method}
            </Text>
            <View className="flex-row gap-2 justify-between">
              <TouchableOpacity
                onPress={() => setRecord({ ...record, paymentMethod: "Card" })}
                className={`flex-1 p-3 rounded-lg ${
                  record.paymentMethod === "Card"
                    ? isDark
                      ? "bg-blue-700"
                      : "bg-blue-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}>
                <Text
                  className={`text-center font-medium ${
                    record.paymentMethod === "Card"
                      ? "text-white"
                      : isDark
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}>
                  {translations.categories.card}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setRecord({ ...record, paymentMethod: "Transfer" })
                }
                className={`flex-1 p-3 rounded-lg ${
                  record.paymentMethod === "Transfer"
                    ? isDark
                      ? "bg-blue-700"
                      : "bg-blue-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}>
                <Text
                  className={`text-center font-medium ${
                    record.paymentMethod === "Transfer"
                      ? "text-white"
                      : isDark
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}>
                  {translations.categories.transfer}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRecord({ ...record, paymentMethod: "Cash" })}
                className={`flex-1 p-3 rounded-lg ${
                  record.paymentMethod === "Cash"
                    ? isDark
                      ? "bg-blue-700"
                      : "bg-blue-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}>
                <Text
                  className={`text-center font-medium ${
                    record.paymentMethod === "Cash"
                      ? "text-white"
                      : isDark
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}>
                  {translations.categories.cash}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 地点输入 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.location}
            </Text>
            <TextInput
              className={`p-3 rounded-lg text-base ${
                isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
              }`}
              placeholder={translations.record.locationPlaceholder}
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              value={record.location}
              onChangeText={(value) =>
                setRecord({ ...record, location: value })
              }
            />
          </View>

          {/* 标签 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.tags}
            </Text>
            <TextInput
              className={`p-3 rounded-lg text-base ${
                isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
              }`}
              placeholder={translations.record.tags}
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              value={record.tags}
              onChangeText={(value) => setRecord({ ...record, tags: value })}
            />
          </View>

          {/* 备注 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.comment}
            </Text>
            <TextInput
              className={`p-3 rounded-lg text-base ${
                isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
              }`}
              placeholder={translations.record.amountPlaceholder}
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              value={record.comment}
              onChangeText={(value) => setRecord({ ...record, comment: value })}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* 提交按钮 */}
          {record.userId === "guest" && (
            <Text className="mt-4 mb-4 text-center text-red-500">
              {translations.guestmode.record}
             
            </Text>
          )}
          <TouchableOpacity
            className={`py-3 rounded-md ${
              record.userId === "guest" ? "bg-gray-400" : "bg-primary"
            }`}
            onPress={handleSubmit}
            disabled={record.userId === "guest" || record.userId === ""}>
            <Text className="font-semibold text-center text-white">
              {translations.record.save}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Record;
