import React from "react";
import { View, Text } from "react-native";

// 
interface RecordShowBoxProps {
  record: MoneyRecord;
}

const RecordShowBox: React.FC<RecordShowBoxProps> = ({ record }) => {
  return (
    <View className="p-4 mb-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <Text className="text-xl font-bold text-primary">
        {record.type === "income" ? "Income" : "Expense"}: ${record.moneyAmount}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        Category: {record.category}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        Location: {record.location || "N/A"}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        Date: {new Date(record.createAt).toLocaleString()}
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400">
        Payment Method: {record.paymentMethod}
      </Text>
      {record.comment && (
        <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Comment: {record.comment}
        </Text>
      )}
    </View>
  );
};

export default RecordShowBox;
