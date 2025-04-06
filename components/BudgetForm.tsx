import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import { createBudget } from "../services/budgetService";
import { BUDGET_CATEGORIES } from "../constants/categories";
import BackButton from "./BackButton";

interface BudgetFormProps {
  userId: string;
  onSuccess?: () => void;
  isGuest?: boolean;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  userId,
  onSuccess,
  isGuest = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { translations } = useLanguage();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState(BUDGET_CATEGORIES[0].value);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleSubmit = async () => {
    try {
      if (isGuest) {
        alert(translations.guestmode.budget);
        return;
      }
      if (!amount) {
        setError(translations.alerts.fillAmountCategory);
        return;
      }

      const budgetData = {
        userId,
        amount: parseFloat(amount),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
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
      setError(translations.alerts.createError);
      setShowErrorModal(true);
      console.error("create budget failed:", err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <View
            className={`mt-16 p-6 rounded-lg ${
              isDark ? "bg-transparent" : "bg-white"
            }`}>
            <View className="absolute top-2 left-2 z-50">
              <BackButton />
            </View>
            <Text
              className={`text-center text-lg font-bold mb-6 ${
                isDark ? "text-white" : "text-secondary"
              }`}>
              {translations.budget.title}
            </Text>

            <View className="mb-6">
              <Text className={`mb-2 ${isDark ? "text-white" : "text-black"}`}>
                {translations.budget.date}
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className={`p-3 border rounded-md ${
                  isDark
                    ? "border-gray-600 bg-tertiary"
                    : "border-gray-300 bg-white"
                }`}>
                <Text className={isDark ? "text-white" : "text-black"}>
                  {`${date.getFullYear()}/ ${date.getMonth() + 1}`}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setDate(selectedDate);
                    }
                  }}
                />
              )}
            </View>

            <View className="mb-6">
              <Text className={`mb-2 ${isDark ? "text-white" : "text-black"}`}>
                {translations.budget.amount}
              </Text>
              <TextInput
                className={`border rounded-md p-2 ${
                  isDark
                    ? "bg-tertiary text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                value={amount}
                onChangeText={setAmount}
                placeholder={translations.budget.amountPlaceholder}
                keyboardType="numeric"
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            {/* category */}
            <View className={`mb-6 border ${isDark ? "border-black" : ""}`}>
              <Text className={`m-2 ${isDark ? "text-white" : "text-black"}`}>
                {translations.budget.category}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {BUDGET_CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setCategory(cat.value)}
                    className={`p-3 rounded-lg flex-grow m-2 ${
                      isDark ? "border border-white " : ""
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

            <View className="mb-6">
              <Text className={`mb-2 ${isDark ? "text-white" : "text-black"}`}>
                {translations.budget.comments}
              </Text>
              <TextInput
                className={`border rounded-md p-2 ${
                  isDark
                    ? "bg-tertiary text-white border-gray-600"
                    : "bg-white text-black border-gray-300"
                }`}
                value={note}
                onChangeText={setNote}
                placeholder={translations.budget.commentsPlaceholder}
                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}

            {isGuest && (
              <Text className="mb-4 text-center text-red-500">
                {translations.guestmode.budget}
              </Text>
            )}

            <TouchableOpacity
              className={`py-3 rounded-md ${
                isGuest ? "bg-gray-400" : "bg-secondary"
              }`}
              onPress={handleSubmit}
              disabled={isGuest}>
              <Text className="font-semibold text-center text-white">
                {translations.budget.save}
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
                    isDark ? "bg-quaternary" : "bg-white"
                  }`}>
                  <Text
                    className={`text-lg font-bold mb-4 text-center ${
                      isDark ? "text-white" : "text-black"
                    }`}>
                    {translations.alerts.createSuccess}
                  </Text>
                  <TouchableOpacity
                    className="px-4 py-2 rounded-md bg-primary"
                    onPress={() => setShowSuccessModal(false)}>
                    <Text className="text-center text-white">
                      {translations.common.confirm}
                    </Text>
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
                    isDark ? "bg-quaternary" : "bg-white"
                  }`}>
                  <Text
                    className={`text-lg font-bold mb-4 text-center ${
                      isDark ? "text-white" : "text-black"
                    }`}>
                    {translations.alerts.createError}
                  </Text>
                  <TouchableOpacity
                    className="px-4 py-2 rounded-md bg-primary"
                    onPress={() => setShowErrorModal(false)}>
                    <Text className="text-center text-white">
                      {translations.common.confirm}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default BudgetForm;
