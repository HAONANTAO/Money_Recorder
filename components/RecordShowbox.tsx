/*
 * @Date: 2025-03-26 17:16:29
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-01 15:57:47
 * @FilePath: /Money_Recorder/components/RecordShowbox.tsx
 */
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

//
interface RecordShowBoxProps {
  record: MoneyRecord;
}

const RecordShowBox: React.FC<RecordShowBoxProps> = ({ record }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { translations } = useLanguage();
  const formatDate = (date: Date | string | number) => {
    const { language } = useLanguage();
    const locale = language === "zh" ? "zh-CN" : "en-US";
    return new Date(date).toLocaleDateString(locale);
  };

  const handlePress = () => {
    router.push(`/(func)/recordDetail?id=${record.$id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${
        isDark ? "border-white" : "bg-white border-blue-200"
      }w-[48%] p-3 mb-4  rounded-lg shadow-md border   active:opacity-80`}>
      <Text
        className={`text-lg font-bold ${
          record.type === "income" ? "text-green-500" : "text-red-500"
        }`}>
        {record.type === "income"
          ? translations.record.income
          : translations.record.expense}
        : ${record.moneyAmount}
      </Text>
      <Text className={`${isDark ? "text-white" : "text-gray-600"} text-sm `}>
        <Text className="text-secondary">{translations.record.category}: </Text>
        {record.category}
      </Text>
      <Text className={`${isDark ? "text-white" : "text-gray-600"} text-sm `}>
        <Text className="text-secondary">{translations.record.date}: </Text>
        {formatDate(record.createAt)}
      </Text>
      <Text className={`${isDark ? "text-white" : "text-gray-600"} text-sm `}>
        <Text className="text-secondary">{translations.record.method}: </Text>
        {record.paymentMethod}
      </Text>
      <Text className={`${isDark ? "text-white" : "text-gray-600"} text-sm `}>
        <Text className="text-secondary">{translations.record.location}: </Text>
        {record.location || "N/A"}
      </Text>

      <Text className="mt-2 text-sm text-secondary">
        {translations.record.tags}:
        {record.tags === "" ? (
          <Text
            className={`${isDark ? "text-white" : "text-gray-600"} text-sm `}>
            {translations.record.none}
          </Text>
        ) : (
          <Text
            className={`${isDark ? "text-white" : "text-gray-600"} text-sm `}>
            {" "}
            {record.tags}
          </Text>
        )}
      </Text>

      <Text className="mt-2 text-sm text-secondary">
        {translations.record.comment}:
        {record.comment === "" ? (
          <Text
            className={`${isDark ? "text-white" : "text-gray-600"} text-sm `}>
            {translations.record.none}
          </Text>
        ) : (
          <Text
            className={`${isDark ? "text-white" : "text-gray-600"} text-sm `}>
            {" "}
            {record.comment}
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );
};

export default RecordShowBox;
