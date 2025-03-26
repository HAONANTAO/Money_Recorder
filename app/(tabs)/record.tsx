import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { createRecord } from "../../services/recordService";
import { StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";

// records 的icons没用到
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

// Income Categories
const INCOME_CATEGORIES = [
  { label: "Salary", value: "salary", icon: "💼" },
  { label: "Sideline", value: "sideline", icon: "📊" },
  { label: "Investment", value: "investment", icon: "📈" },
  { label: "Bonus", value: "bonus", icon: "💵" },
  { label: "Other", value: "other", icon: "🌍" },
];
const Record = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [record, setRecord] = useState({
    userId: "",
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
      if (!record.moneyAmount || !record.category) {
        alert("Pleas filled amount and category");
        return;
      }
      const newRecord = await createRecord({
        ...record,
        moneyAmount: parseFloat(record.moneyAmount),
        tags: record.tags.split(",").filter(Boolean).join(","),
      });
      alert("record create successfully");
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
      alert("failed create record,try again");
    }
  };

  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-quaternary" : "bg-gray-100"}`}>
      <View className="p-5">
        <Text
          className={`mt-12 text-2xl font-bold mb-5 text-center ${
            isDark ? "text-secondary" : "text-quaternary"
          }`}>
          Add Record
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
          <View className={`flex-row items-center p-3 bg-white rounded-lg`}>
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
              value={record.moneyAmount}
              onChangeText={(value) =>
                setRecord({ ...record, moneyAmount: value })
              }
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
            Type
          </Text>
          <View
            className={`${
              isDark ? "" : "bg-white"
            }overflow-hidden  rounded-lg`}>
            <Picker
              selectedValue={record.type}
              onValueChange={(value) => setRecord({ ...record, type: value })}
              className={`h-12 ${
                isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
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
              selectedValue={record.category}
              onValueChange={(value) =>
                setRecord({ ...record, category: value })
              }
              className={`h-12 ${
                isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
              }`}>
              <Picker.Item
                label="Choose category"
                value="Choose category"
                color={isDark ? "#1e67e5" : "#1c64f3"}
              />
              {(record.type === "expense"
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

        {/* 支付方式 */}
        <View
          className={`mb-4 ${
            isDark ? "bg-quaternary" : "bg-white"
          } rounded-xl p-4`}>
          <Text
            className={`mb-2 text-base font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
            Payment method
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
                Card
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
                Transfer
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
                Cash
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
            Location
          </Text>
          <TextInput
            className={`p-3 rounded-lg text-base ${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
            }`}
            placeholder="Enter location"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={record.location}
            onChangeText={(value) => setRecord({ ...record, location: value })}
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
            Labels
          </Text>
          <TextInput
            className={`p-3 rounded-lg text-base ${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
            }`}
            placeholder="multiple tags separated by commas"
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
            Comments
          </Text>
          <TextInput
            className={`p-3 rounded-lg text-base ${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
            }`}
            placeholder="add comment..."
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={record.comment}
            onChangeText={(value) => setRecord({ ...record, comment: value })}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* 提交按钮 */}
        <TouchableOpacity
          onPress={handleSubmit}
          className={`p-4 rounded-xl mb-6 mt-2 ${
            isDark ? "bg-blue-700" : "bg-blue-500"
          }`}>
          <Text className="text-base font-semibold text-center text-white">
            Save Record
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Record;
