import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import BackButton from "@/components/BackButton";
import { deleteRecord, getRecordById } from "@/services/recordService";
import {
  EXPENSE_CATEGORIES2,
  INCOME_CATEGORIES2,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/constants/categories";

const RecordDetail = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { translations } = useLanguage();
  const { id } = useLocalSearchParams();
  const [record, setRecord] = React.useState<MoneyRecord | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { language } = useLanguage();

  useFocusEffect(
    // useCallback 是 React 的一个 性能优化 Hook，它的作用是 缓存函数，防止不必要的重新创建。
    useCallback(() => {
      const fetchRecord = async () => {
        try {
          setLoading(true);
          const recordData = await getRecordById(id as string);
          setRecord(recordData as unknown as MoneyRecord);
        } catch (error) {
          console.error("Error fetching record:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchRecord();
    }, [id]), // 依赖 `id`，如果 id 变了，也会重新拉取数据
  );

  const formatDate = (date: Date | string | number) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!record) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{translations.record.none}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 16,
      }}
      className={`${isDark ? "bg-gray-900" : "bg-gray-100"} flex-1`}>
      <View className="absolute left-4 top-12 z-50">
        <BackButton />
      </View>
      <Text className="mt-20 w-full text-2xl font-bold text-center text-black">
        Transaction Details
      </Text>
      <View
        className={`p-6 mt-16 w-full max-w-lg  rounded-3xl shadow-lg ${
          isDark ? "bg-gray-600" : "bg-white"
        }`}>
        <Text
          className={`mb-6 text-5xl font-extrabold text-center ${
            record.type === "income" ? "text-green-500" : "text-red-500"
          }`}>
          ${record.moneyAmount.toLocaleString()}
        </Text>

        <View className="space-y-6">
          <View className="flex-row justify-between items-center pb-3 border-b border-gray-300">
            <Text className="text-lg font-semibold text-black">
              {translations.record.type}
            </Text>
            <View className="flex-row items-center space-x-3">
              <Text className="text-xl font-bold text-black">
                {record.type === "income"
                  ? translations.record.income
                  : translations.record.expense}
              </Text>
              <Ionicons
                name={
                  record.type === "income"
                    ? "arrow-up-circle"
                    : "arrow-down-circle"
                }
                size={24}
                color={record.type === "income" ? "#10b981" : "#ef4444"}
              />
            </View>
          </View>
          <View className="flex-row justify-between items-center pb-3 border-b border-gray-300">
            <Text className="text-lg font-semibold text-black">
              {translations.categories.category}
            </Text>
            <View className="flex-row items-center space-x-3">
              <Text className="text-xl font-bold text-black">
                {record.type === "income"
                  ? language === "en"
                    ? INCOME_CATEGORIES.find(
                        (cat) => cat.value === record.category,
                      )?.label
                    : INCOME_CATEGORIES2.find(
                        (cat) => cat.value === record.category,
                      )?.label
                  : language === "en"
                  ? EXPENSE_CATEGORIES.find(
                      (cat) => cat.value === record.category,
                    )?.label
                  : EXPENSE_CATEGORIES2.find(
                      (cat) => cat.value === record.category,
                    )?.label}
              </Text>
              <Text className="text-xl">
                {record.type === "income"
                  ? INCOME_CATEGORIES.find(
                      (cat) => cat.value === record.category,
                    )?.icon
                  : EXPENSE_CATEGORIES.find(
                      (cat) => cat.value === record.category,
                    )?.icon}
              </Text>
            </View>
          </View>

          <View className="flex-row justify-between items-center pb-3 border-b border-gray-300">
            <Text className="text-lg font-semibold text-black">
              {translations.record.date}
            </Text>
            <View className="flex-row items-center space-x-3">
              <Text className="text-xl font-bold text-black">
                {formatDate(record.createAt)}
              </Text>
              <Ionicons name="calendar" size={24} color="#3b82f6" />
            </View>
          </View>

          <View className="flex-row justify-between items-center pb-3 border-b border-gray-300">
            <Text className="text-lg font-semibold text-black">
              {translations.record.method}
            </Text>
            <View className="flex-row items-center space-x-3">
              <Text className="text-xl font-bold text-black">
                {
                  translations.categories[
                    record.paymentMethod.toLowerCase() as keyof typeof translations.categories
                  ]
                }
              </Text>
              <Ionicons
                name={
                  record.paymentMethod.toLowerCase() === "cash"
                    ? "cash"
                    : record.paymentMethod.toLowerCase() === "card"
                    ? "card"
                    : "swap-horizontal"
                }
                size={24}
                color={
                  record.paymentMethod.toLowerCase() === "cash"
                    ? "#f59e0b"
                    : record.paymentMethod.toLowerCase() === "card"
                    ? "#0ea5e9"
                    : "#ec4899"
                }
              />
            </View>
          </View>

          <View className="flex-row justify-between items-center pb-3 border-b border-gray-300">
            <Text className="text-lg font-semibold text-black">
              {translations.record.location}
            </Text>
            <Text className="text-xl font-bold text-black">
              {record.location || "N/A"}
            </Text>
          </View>

          {/* tags */}
          <View className="flex-row justify-between items-center pb-3 border-b border-gray-300">
            <Text className="text-lg font-semibold text-black">
              {translations.record.tags}
            </Text>
            <Text className="text-xl font-bold text-black">
              {record.tags || "N/A"}
            </Text>
          </View>
          {record.comment && (
            <View className="p-4 mt-6 bg-gray-100 rounded-lg">
              <Text className="mb-2 text-lg font-semibold text-black">
                {translations.record.comment}
              </Text>
              <Text className="text-base text-secondary">{record.comment}</Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row justify-evenly px-4 mt-8 w-full max-w-lg">
        {/* update button */}
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/(func)/editRecord",
              params: { id: record.$id },
            });
          }}
          className="px-6 py-4 w-40 bg-blue-600 rounded-full shadow-lg hover:bg-blue-500">
          <View className="flex-row justify-center items-center space-x-3">
            <Ionicons name="pencil" size={24} color="#22c55e" />
            <Text className="text-lg font-semibold text-center text-white">
              {translations.common.update}
            </Text>
          </View>
        </TouchableOpacity>

        {/* delete button */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              translations.alerts.deleteTransaction.title,
              translations.alerts.deleteTransaction.message,
              [
                { text: translations.common.cancel, style: "cancel" },
                {
                  text: "OK",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await deleteRecord(record.$id);
                      router.replace({
                        pathname: "/(tabs)/home",
                        params: { refresh: "true" },
                      });
                    } catch (error) {
                      console.error("Failed to delete record:", error);
                      Alert.alert(
                        translations.common.error,
                        translations.alerts.deleteTransaction.error,
                      );
                    }
                  },
                },
              ],
            );
          }}
          className="px-6 py-4 w-40 bg-red-600 rounded-full shadow-lg hover:bg-red-500">
          <View className="flex-row justify-center items-center space-x-2">
            <Ionicons name="trash" size={24} color="#fecaca" />
            <Text className="text-lg font-semibold text-center text-white">
              {translations.common.delete}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RecordDetail;
