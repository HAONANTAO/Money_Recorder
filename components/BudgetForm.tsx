import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "../contexts/ThemeContext";
import { createBudget } from "../services/budgetService";
import { BUDGET_CATEGORIES } from "../constants/categories";

interface BudgetFormProps {
  userId: string;
  onSuccess?: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ userId, onSuccess }) => {
  const { theme } = useTheme();
  const [amount, setAmount] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [category, setCategory] = useState(BUDGET_CATEGORIES[0].value);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!amount) {
        setError("Enter budget amount");
        return;
      }

      const budgetData = {
        userId,
        amount: parseFloat(amount),
        year,
        month,
        category,
        note,
      };

      await createBudget(budgetData);
      setAmount("");
      setCategory(BUDGET_CATEGORIES[0].value);
      setNote("");
      setError("");
      setShowSuccessModal(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError("create budget failed,pls try again");
      setShowErrorModal(true);
      console.error("create budget failed:", err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>
        <View
          className={`mt-12 p-4  rounded-lg ${
            theme === "dark" ? "bg-quaternary" : "bg-white"
          }`}>
          <Text
            className={`text-center text-lg font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-secondary"
            }`}>
            Set The Budget
          </Text>

          <View className="mb-4">
            <Text
              className={`mb-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}>
              Budget Date
            </Text>
            <View className="flex-row space-x-2">
              <View
                className={`flex-1 border rounded-md overflow-hidden ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                }`}>
                <Picker
                  selectedValue={String(year)}
                  onValueChange={(itemValue) => setYear(Number(itemValue))}
                  style={{
                    backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                  itemStyle={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
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
              <View
                className={`flex-1 border rounded-md overflow-hidden ${
                  theme === "dark" ? "border-gray-600" : "border-gray-300"
                }`}>
                <Picker
                  selectedValue={String(month)}
                  onValueChange={(itemValue) => setMonth(Number(itemValue))}
                  style={{
                    backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                  itemStyle={{
                    color: theme === "dark" ? "#FFFFFF" : "#000000",
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

          <View className="mb-4">
            <Text
              className={`mb-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}>
              Budget Amount
            </Text>
            <TextInput
              className={`border rounded-md p-2 ${
                theme === "dark"
                  ? "bg-tertiary text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
              value={amount}
              onChangeText={setAmount}
              placeholder="Please enter amount"
              keyboardType="numeric"
              placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>

          <View className="mb-4">
            <Text
              className={`mb-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}>
              Budget Category
            </Text>
            <View
              className={`border rounded-md overflow-hidden ${
                theme === "dark" ? "border-gray-600" : "border-gray-300"
              }`}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue: string) => setCategory(itemValue)}
                style={{
                  backgroundColor: theme === "dark" ? "#374151" : "#FFFFFF",
                  color: theme === "dark" ? "#FFFFFF" : "#000000",
                }}
                itemStyle={{ color: theme === "dark" ? "#FFFFFF" : "#000000" }}>
                {BUDGET_CATEGORIES.map((cat) => (
                  <Picker.Item
                    key={cat.value}
                    label={`${cat.icon} ${cat.label}`}
                    value={cat.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mb-4">
            <Text
              className={`mb-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}>
              Comments
            </Text>
            <TextInput
              className={`border rounded-md p-2 ${
                theme === "dark"
                  ? "bg-tertiary text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
              value={note}
              onChangeText={setNote}
              placeholder="Please enter comments"
              placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>

          {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}

          <TouchableOpacity
            className="py-3 rounded-md bg-primary"
            onPress={handleSubmit}>
            <Text className="font-semibold text-center text-white">
              Save The Budget
            </Text>
          </TouchableOpacity>

          {/* 成功提示Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showSuccessModal}
            onRequestClose={() => setShowSuccessModal(false)}>
            <View className="flex-1 justify-center items-center bg-black/50">
              <View
                className={`m-5 p-5 rounded-lg ${
                  theme === "dark" ? "bg-quaternary" : "bg-white"
                }`}>
                <Text
                  className={`text-lg font-bold mb-4 text-center ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}>
                  Create Budget Successfully
                </Text>
                <TouchableOpacity
                  className="px-4 py-2 rounded-md bg-primary"
                  onPress={() => setShowSuccessModal(false)}>
                  <Text className="text-center text-white">Confirmed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* 失败提示Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showErrorModal}
            onRequestClose={() => setShowErrorModal(false)}>
            <View className="flex-1 justify-center items-center bg-black/50">
              <View
                className={`m-5 p-5 rounded-lg ${
                  theme === "dark" ? "bg-quaternary" : "bg-white"
                }`}>
                <Text
                  className={`text-lg font-bold mb-4 text-center ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}>
                  Create Budget Failed
                </Text>
                <TouchableOpacity
                  className="px-4 py-2 rounded-md bg-primary"
                  onPress={() => setShowErrorModal(false)}>
                  <Text className="text-center text-white">Confirmed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default BudgetForm;
