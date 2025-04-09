/*
 * @Date: 2025-03-29 16:31:38
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-09 15:43:59
 * @FilePath: /Money_Recorder/app/(func)/editRecord.tsx
 */
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
// import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { getRecordById, updateRecord } from "@/services/recordService";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import BackButton from "@/components/BackButton";
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORIES2,
  INCOME_CATEGORIES,
  INCOME_CATEGORIES2,
} from "@/constants/categories";

const EditRecord = () => {
  const { theme } = useTheme();
  const { translations, language } = useLanguage();
  const isDark = theme === "dark";
  const currentExpenseCategories =
    language === "en" ? EXPENSE_CATEGORIES : EXPENSE_CATEGORIES2;
  const currentIncomeCategories =
    language === "en" ? INCOME_CATEGORIES : INCOME_CATEGORIES2;
  const { id } = useLocalSearchParams();
  const [record, setRecord] = useState<MoneyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    moneyAmount: "",
    type: "",
    category: "",
    paymentMethod: "",
    location: "",
    tags: "",
    comment: "",
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const recordData = await getRecordById(id as string);
        setRecord(recordData as unknown as MoneyRecord);
        setFormData({
          moneyAmount: recordData.moneyAmount.toString(),
          type: recordData.type,
          category: recordData.category,
          paymentMethod: recordData.paymentMethod,
          location: recordData.location || "",
          tags: recordData.tags || "",
          comment: recordData.comment || "",
        });
      } catch (error) {
        console.error("Error fetching record:", error);
        Alert.alert(
          translations.common.error,
          translations.alerts.clearCache.error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleUpdate = async () => {
    try {
      if (!record) return;

      const updatedRecord = {
        ...formData,
        moneyAmount: parseFloat(formData.moneyAmount),
      };

      // 从 updatedRecord 中排除 $id、userId 和 createAt 字段
      const { ...updateData } = updatedRecord;
      // 确保 type 字段的值为 'income' 或 'expense'
      const validatedData = {
        ...updateData,
        type: updateData.type as "income" | "expense",
      };
      await updateRecord(id as string, validatedData);
      Alert.alert(
        translations.common.success,
        translations.alerts.budget.updateMessage,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.error("Error updating record:", error);
      Alert.alert(
        translations.common.error,
        translations.alerts.clearCache.error,
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className={`flex-1 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
        <View className="absolute left-4 top-12 z-50">
          <BackButton />
        </View>
        <View className="p-5">
          <Text
            className={`mt-12 text-2xl font-bold mb-5 text-center ${
              isDark ? "text-secondary" : "text-quaternary"
            }`}>
            {translations.record.title}
          </Text>

          {/* 金额输入 */}
          <View
            className={`mb-4 border ${
              isDark ? "bg-transparent" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? " text-white" : "text-gray-700"
              }`}>
              {translations.record.amount}
            </Text>
            <TouchableOpacity
              onPress={() => {}}
              className={`flex-row items-center p-3  rounded-lg ${
                isDark ? "bg-transparent" : "bg-white"
              }`}>
              <Text
                className={`text-xl mr-2 font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                $
              </Text>
              <TextInput
                placeholder={translations.record.amountPlaceholder}
                placeholderTextColor={isDark ? "white" : "#6B7280"}
                keyboardType="numeric"
                value={formData.moneyAmount}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                onChangeText={(text) =>
                  setFormData({ ...formData, moneyAmount: text })
                }
                className={`flex-1 ${isDark ? "text-white" : ""}`}
              />
            </TouchableOpacity>
          </View>

          {/* 类型选择 */}
          <View
            className={`mb-4 border ${
              isDark ? "bg-transparent" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-white" : "text-gray-700"
              }`}>
              {translations.record.type}
            </Text>
            <View className="flex-row justify-around space-x-4">
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, type: "expense" })}
                className={`flex-1 p-3 rounded-lg border border-gray-200 ${
                  formData.type === "expense"
                    ? isDark
                      ? "bg-red-700"
                      : "bg-red-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}>
                <Text
                  className={`text-center font-medium ${
                    formData.type === "expense"
                      ? "text-white"
                      : isDark
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}>
                  {translations.record.expense}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, type: "income" })}
                className={`flex-1 p-3 rounded-lg border border-gray-200 ${
                  formData.type === "income"
                    ? isDark
                      ? "bg-green-700"
                      : "bg-green-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-200"
                }`}>
                <Text
                  className={`text-center font-medium ${
                    formData.type === "income"
                      ? "text-white"
                      : isDark
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}>
                  {translations.record.income}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 类别选择 */}
          <View
            className={`mb-4 border ${
              isDark ? "bg-transparent" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.category}
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {(formData.type === "expense"
                ? currentExpenseCategories
                : currentIncomeCategories
              ).map((category) => (
                <TouchableOpacity
                  key={category.value}
                  onPress={() =>
                    setFormData({ ...formData, category: category.value })
                  }
                  className={`p-3 rounded-lg flex-grow border border-gray-200 ${
                    formData.category === category.value
                      ? isDark
                        ? "bg-blue-700"
                        : "bg-blue-500"
                      : isDark
                      ? "bg-gray-700"
                      : "bg-gray-200"
                  }`}>
                  <Text
                    className={`text-center font-medium ${
                      formData.category === category.value
                        ? "text-white"
                        : isDark
                        ? "text-gray-200"
                        : "text-gray-700"
                    }`}>
                    {`${category.icon} ${category.label}`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 支付方式选择 */}
          <View
            className={`mb-4 border ${
              isDark ? "bg-transparent" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.method}
            </Text>
            <View className="flex-row justify-around">
              <TouchableOpacity
                onPress={() =>
                  setFormData({ ...formData, paymentMethod: "Card" })
                }
                className={`flex-1 mx-1 p-4 rounded-lg ${
                  formData.paymentMethod === "Card"
                    ? isDark
                      ? "bg-blue-700"
                      : "bg-blue-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-200"
                } ${isDark ? "border border-gray-200" : ""}`}>
                <Text
                  className={`text-center font-medium ${
                    formData.paymentMethod === "Card"
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
                  setFormData({ ...formData, paymentMethod: "Transfer" })
                }
                className={`flex-1 mx-1 p-4 rounded-lg ${
                  formData.paymentMethod === "Transfer"
                    ? isDark
                      ? "bg-blue-700"
                      : "bg-blue-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-200"
                } ${isDark ? "border border-gray-200" : ""}`}>
                <Text
                  className={`text-center font-medium ${
                    formData.paymentMethod === "Transfer"
                      ? "text-white"
                      : isDark
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}>
                  {translations.categories.transfer}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setFormData({ ...formData, paymentMethod: "Cash" })
                }
                className={`flex-1 mx-1 p-4 rounded-lg ${
                  formData.paymentMethod === "Cash"
                    ? isDark
                      ? "bg-blue-700"
                      : "bg-blue-500"
                    : isDark
                    ? "bg-gray-700"
                    : "bg-gray-200"
                } ${isDark ? "border border-gray-200" : ""}`}>
                <Text
                  className={`text-center font-medium ${
                    formData.paymentMethod === "Cash"
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

          {/* 位置输入 */}
          <View
            className={`mb-4 border ${
              isDark ? "bg-transparent" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.location}
            </Text>
            <View
              className={`flex-row items-center p-3 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-white"
              }`}>
              <TextInput
                placeholder={translations.record.locationPlaceholder}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={formData.location}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                className={`flex-1 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              />
            </View>
          </View>

          {/* 标签输入 */}
          <View
            className={`mb-4 border ${
              isDark ? "bg-transparent" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.tags}
            </Text>
            <View
              className={`flex-row items-center p-3 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-white"
              }`}>
              <TextInput
                placeholder={translations.record.tagsPlaceholder}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={formData.tags}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                onChangeText={(text) =>
                  setFormData({ ...formData, tags: text })
                }
                className={`flex-1 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              />
            </View>
          </View>

          {/* 备注输入 */}
          <View
            className={`mb-4 border ${
              isDark ? "bg-transparent" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              {translations.record.comment}
            </Text>
            <View
              className={`flex-row items-start p-3 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-white"
              }`}>
              <TextInput
                placeholder={translations.record.commentPlaceholder}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={formData.comment}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                multiline
                numberOfLines={3}
                onChangeText={(text) =>
                  setFormData({ ...formData, comment: text })
                }
                className={`flex-1 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              />
            </View>
          </View>

          {/* 保存按钮 */}
          <TouchableOpacity
            onPress={handleUpdate}
            className="px-6 py-4 mt-6 rounded-full shadow-lg bg-primary">
            <Text className="text-lg font-semibold text-center text-white">
              {translations.record.update}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default EditRecord;
