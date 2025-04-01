/*
 * @Date: 2025-03-26 17:16:29
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-30 20:44:49
 * @FilePath: /Money_Recorder/components/RecordShowbox.tsx
 */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useLanguage } from "../contexts/LanguageContext";

//
interface RecordShowBoxProps {
  record: MoneyRecord;
}

const RecordShowBox: React.FC<RecordShowBoxProps> = ({ record }) => {
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
      className="w-[48%] p-3 mb-4 bg-white rounded-lg shadow-md border border-blue-200  active:opacity-80">
      <Text
        className={`text-lg font-bold ${
          record.type === "income" ? "text-green-500" : "text-red-500"
        }`}>
        {record.type === "income"
          ? translations.record.income
          : translations.record.expense}
        : ${record.moneyAmount}
      </Text>
      <Text className="text-sm text-gray-600">
        <Text className="text-secondary">{translations.record.category}: </Text>
        {record.category}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        <Text className="text-secondary">{translations.record.date}: </Text>
        {formatDate(record.createAt)}
      </Text>
      <Text className="text-sm text-gray-600">
        <Text className="text-secondary">{translations.record.method}: </Text>
        {record.paymentMethod}
      </Text>
      <Text className="text-sm text-gray-600">
        <Text className="text-secondary">{translations.record.location}: </Text>
        {record.location || "N/A"}
      </Text>

      <Text className="mt-2 text-sm text-secondary">
        {translations.record.tags}:
        {record.tags === "" ? (
          <Text className="text-gray-600">{translations.record.none}</Text>
        ) : (
          <Text className="text-gray-600"> {record.tags}</Text>
        )}
      </Text>

      <Text className="mt-2 text-sm text-secondary">
        {translations.record.comment}:
        {record.comment === "" ? (
          <Text className="text-gray-600">{translations.record.none}</Text>
        ) : (
          <Text className="text-gray-600"> {record.comment}</Text>
        )}
      </Text>
    </TouchableOpacity>
  );
};

export default RecordShowBox;
