/*
 * @Date: 2025-03-26 17:16:29
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-28 13:39:26
 * @FilePath: /Money_Recorder/components/RecordShowbox.tsx
 */
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";

//
interface RecordShowBoxProps {
  record: MoneyRecord;
}

const RecordShowBox: React.FC<RecordShowBoxProps> = ({ record }) => {
  const formatDate = (date: Date | string | number) => {
    return new Date(date).toLocaleDateString();
  };

  const handlePress = () => {
    router.push(`/(func)/recordDetail?id=${record.$id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-[48%] p-3 mb-4 bg-white rounded-lg shadow-md border border-blue-100 dark:bg-gray-800 dark:border-blue-900 active:opacity-80">
      <Text
        className={`text-lg font-bold ${
          record.type === "income" ? "text-green-500" : "text-red-500"
        }`}>
        {record.type === "income" ? "Income" : "Expense"}: ${record.moneyAmount}
      </Text>
      <Text className="text-sm text-gray-600">
        <Text className="text-secondary">Category: </Text>
        {record.category}
      </Text>

      <Text className="text-sm text-gray-600 dark:text-gray-400">
        <Text className="text-secondary">Date: </Text>
        {formatDate(record.createAt)}
      </Text>
      <Text className="text-sm text-gray-600">
        <Text className="text-secondary">Method: </Text>
        {record.paymentMethod}
      </Text>
      <Text className="text-sm text-gray-600">
        <Text className="text-secondary">Location: </Text>
        {record.location || "N/A"}
      </Text>
      {record.comment && (
        <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Comment: {record.comment}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default RecordShowBox;
