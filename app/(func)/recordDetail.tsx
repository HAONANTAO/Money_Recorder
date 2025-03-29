/*
 * @Date: 2025-03-29 15:37:24
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-29 15:49:39
 * @FilePath: /Money_Recorder/app/(func)/recordDetail.tsx
 */
import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { getRecordById } from "@/services/recordService";

const RecordDetail = () => {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const [record, setRecord] = React.useState<MoneyRecord | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRecord = async () => {
      try {
        const recordData = await getRecordById(id as string);
        setRecord(recordData as unknown as MoneyRecord);
      } catch (error) {
        console.error("Error fetching record:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const formatDate = (date: Date | string | number) => {
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!record) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Record not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 p-4 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <View className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <Text
          className={`text-3xl font-bold mb-4 ${
            record.type === "income" ? "text-green-500" : "text-red-500"
          }`}>
          ${record.moneyAmount}
        </Text>

        <View className="space-y-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              Type
            </Text>
            <Text className="text-lg font-medium">
              {record.type === "income" ? "Income" : "Expense"}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              Category
            </Text>
            <Text className="text-lg font-medium">{record.category}</Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              Date
            </Text>
            <Text className="text-lg font-medium">
              {formatDate(record.createAt)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              Payment Method
            </Text>
            <Text className="text-lg font-medium">{record.paymentMethod}</Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              Location
            </Text>
            <Text className="text-lg font-medium">
              {record.location || "N/A"}
            </Text>
          </View>

          {record.comment && (
            <View className="mt-4">
              <Text className="mb-2 text-lg text-gray-600 dark:text-gray-400">
                Comment
              </Text>
              <Text className="text-lg">{record.comment}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default RecordDetail;
