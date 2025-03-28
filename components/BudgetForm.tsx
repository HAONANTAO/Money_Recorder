import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { createBudget } from "../services/budgetService";

interface BudgetFormProps {
  userId: string;
  onSuccess?: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ userId, onSuccess }) => {
  const { theme } = useTheme();
  const [amount, setAmount] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (!amount || isNaN(Number(amount))) {
        setError("请输入有效的预算金额");
        return;
      }

      const budgetData = {
        userId,
        amount: Number(amount),
        year,
        month,
        category,
        note,
      };

      await createBudget(budgetData);
      setAmount("");
      setCategory("");
      setNote("");
      setError("");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("创建预算失败，请重试");
      console.error("创建预算失败:", err);
    }
  };

  return (
    <View
      className={`p-4 rounded-lg ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <Text
        className={`text-lg font-bold mb-4 ${
          theme === "dark" ? "text-white" : "text-black"
        }`}>
        设置预算
      </Text>

      <View className="mb-4">
        <Text
          className={`mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
          预算年月
        </Text>
        <View className="flex-row space-x-2">
          <TextInput
            className={`flex-1 border rounded-md p-2 ${
              theme === "dark"
                ? "bg-tertiary text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            value={String(year)}
            onChangeText={(text) => setYear(Number(text))}
            placeholder="年份"
            keyboardType="numeric"
            placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
          <TextInput
            className={`flex-1 border rounded-md p-2 ${
              theme === "dark"
                ? "bg-tertiary text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            value={String(month)}
            onChangeText={(text) => {
              const value = Number(text);
              if (value >= 1 && value <= 12) {
                setMonth(value);
              }
            }}
            placeholder="月份(1-12)"
            keyboardType="numeric"
            placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
        </View>
      </View>

      <View className="mb-4">
        <Text
          className={`mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
          预算金额
        </Text>
        <TextInput
          className={`border rounded-md p-2 ${
            theme === "dark"
              ? "bg-tertiary text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          value={amount}
          onChangeText={setAmount}
          placeholder="输入预算金额"
          keyboardType="numeric"
          placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
        />
      </View>

      <View className="mb-4">
        <Text
          className={`mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
          预算类别
        </Text>
        <TextInput
          className={`border rounded-md p-2 ${
            theme === "dark"
              ? "bg-tertiary text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          value={category}
          onChangeText={setCategory}
          placeholder="输入预算类别（可选）"
          placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
        />
      </View>

      <View className="mb-4">
        <Text
          className={`mb-2 ${theme === "dark" ? "text-white" : "text-black"}`}>
          备注（可选）
        </Text>
        <TextInput
          className={`border rounded-md p-2 ${
            theme === "dark"
              ? "bg-tertiary text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
          value={note}
          onChangeText={setNote}
          placeholder="输入备注信息"
          placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
        />
      </View>

      {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}

      <TouchableOpacity
        className="py-3 rounded-md bg-primary"
        onPress={handleSubmit}>
        <Text className="font-semibold text-center text-white">保存预算</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BudgetForm;
