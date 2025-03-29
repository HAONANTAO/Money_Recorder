/*
 * @Date: 2025-03-29 16:31:38
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-29 22:49:40
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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { getRecordById, updateRecord } from "@/services/recordService";
import { useTheme } from "../../contexts/ThemeContext";

// Income Categories
const INCOME_CATEGORIES = [
  { label: "Salary", value: "salary", icon: "💼" },
  { label: "Sideline", value: "sideline", icon: "📊" },
  { label: "Investment", value: "investment", icon: "📈" },
  { label: "Bonus", value: "bonus", icon: "💵" },
  { label: "Other", value: "other", icon: "🌍" },
];

// Expense Categories
const EXPENSE_CATEGORIES = [
  { label: "Eating", value: "eating", icon: "🍔" },
  { label: "Traffic", value: "traffic", icon: "🚗" },
  { label: "Shopping", value: "shopping", icon: "🛍️" },
  { label: "Entertainment", value: "entertainment", icon: "🎮" },
  { label: "Living", value: "living", icon: "🏠" },
  { label: "Medication", value: "medication", icon: "💊" },
  { label: "Education", value: "education", icon: "🎓" },
  { label: "Others", value: "others", icon: "🌍" },
];

const EditRecord = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { id } = useLocalSearchParams();
  const [record, setRecord] = useState<MoneyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    moneyAmount: "",
    type: "",
    category: "",
    paymentMethod: "",
    location: "",
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
          comment: recordData.comment || "",
        });
      } catch (error) {
        console.error("Error fetching record:", error);
        Alert.alert("Error", "Failed to obtain records");
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
      Alert.alert("Success", "Record updated", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating record:", error);
      Alert.alert("Error", "Update record failed");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        className={`flex-1 ${isDark ? "bg-quaternary" : "bg-gray-100"}`}>
        <View className="p-5">
          <Text
            className={`mt-12 text-2xl font-bold mb-5 text-center ${
              isDark ? "text-secondary" : "text-quaternary"
            }`}>
            Edit Record
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
              Amount
            </Text>
            <TouchableOpacity
              onPress={() => {}}
              className={`flex-row items-center p-3 bg-white rounded-lg`}>
              <Text
                className={`text-xl mr-2 font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}>
                $
              </Text>
              <TextInput
                placeholder="0.00"
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                keyboardType="numeric"
                value={formData.moneyAmount}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                onChangeText={(text) =>
                  setFormData({ ...formData, moneyAmount: text })
                }
                className="flex-1"
              />
            </TouchableOpacity>
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
              Type
            </Text>
            <View
              className={`${
                isDark ? "" : "bg-white"
              }overflow-hidden rounded-lg`}>
              <Picker
                selectedValue={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
                className={`h-12 ${
                  isDark
                    ? "bg-gray-700 text-gray-200"
                    : "bg-white text-gray-800"
                }`}>
                <Picker.Item
                  label="Expense"
                  value="expense"
                  color={isDark ? "#EF4444" : "#DC2626"}
                />
                <Picker.Item
                  label="Income"
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
              Category
            </Text>
            <View
              className={`${
                isDark ? "" : "bg-white"
              }overflow-hidden  rounded-lg`}>
              <Picker
                selectedValue={record?.category || ""}
                onValueChange={(value) =>
                  setRecord(
                    record
                      ? ({ ...record, category: value } as MoneyRecord)
                      : null,
                  )
                }
                className={`h-12 ${
                  isDark
                    ? "bg-gray-700 text-gray-200"
                    : "bg-white text-gray-800"
                }`}>
                <Picker.Item
                  label="Choose category"
                  value="Choose category"
                  color={isDark ? "#1e67e5" : "#1c64f3"}
                />
                {(record!.type === "expense"
                  ? EXPENSE_CATEGORIES
                  : INCOME_CATEGORIES
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

          {/* 支付方式选择 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              Payment Method
            </Text>
            <View className="flex-row justify-around">
              <TouchableOpacity
                onPress={() =>
                  setFormData({ ...formData, paymentMethod: "Card" })
                }
                className={`flex-1 mx-1 p-4 rounded-lg ${
                  formData.paymentMethod === "Card"
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}>
                <Text
                  className={`text-center font-medium ${
                    formData.paymentMethod === "Card"
                      ? "text-white"
                      : "text-gray-700"
                  }`}>
                  Card
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setFormData({ ...formData, paymentMethod: "Transfer" })
                }
                className={`flex-1 mx-1 p-4 rounded-lg ${
                  formData.paymentMethod === "Transfer"
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}>
                <Text
                  className={`text-center font-medium ${
                    formData.paymentMethod === "Transfer"
                      ? "text-white"
                      : "text-gray-700"
                  }`}>
                  Transfer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  setFormData({ ...formData, paymentMethod: "Cash" })
                }
                className={`flex-1 mx-1 p-4 rounded-lg ${
                  formData.paymentMethod === "Cash"
                    ? "bg-primary"
                    : "bg-gray-200"
                }`}>
                <Text
                  className={`text-center font-medium ${
                    formData.paymentMethod === "Cash"
                      ? "text-white"
                      : "text-gray-700"
                  }`}>
                  Cash
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 位置输入 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              Location
            </Text>
            <View className={`flex-row items-center p-3 bg-white rounded-lg`}>
              <TextInput
                placeholder="enter the location..."
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={formData.location}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                className="flex-1"
              />
            </View>
          </View>

          {/* 备注输入 */}
          <View
            className={`mb-4 ${
              isDark ? "bg-quaternary" : "bg-white"
            } rounded-xl p-4`}>
            <Text
              className={`mb-2 text-base font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              Comment
            </Text>
            <View className={`flex-row items-start p-3 bg-white rounded-lg`}>
              <TextInput
                placeholder="add comment..."
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                value={formData.comment}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                multiline
                numberOfLines={4}
                onChangeText={(text) =>
                  setFormData({ ...formData, comment: text })
                }
                className="flex-1 min-h-[100px]"
              />
            </View>
          </View>

          {/* 保存按钮 */}
          <TouchableOpacity
            onPress={handleUpdate}
            className="px-6 py-4 mt-6 rounded-full shadow-lg bg-primary">
            <Text className="text-lg font-semibold text-center text-white">
              保存更新
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default EditRecord;
