/*
 * @Date: 2025-03-29 15:37:24
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-29 16:01:08
 * @FilePath: /Money_Recorder/app/(func)/recordDetail.tsx
 */
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { deleteRecord, getRecordById } from "@/services/recordService";

const RecordDetail = () => {
  const { theme } = useTheme();
  // 传递过来的id
  const { id } = useLocalSearchParams();
  const [record, setRecord] = React.useState<MoneyRecord | null>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
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
      <View className="p-6 bg-gradient-to-br rounded-2xl border shadow-2xl backdrop-blur-sm transition-all duration-300 ease-in-out from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 border-gray-100/50 dark:border-gray-700/50">
        <Text
          className={`text-5xl font-bold mb-8 ${
            record.type === "income"
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-rose-500 to-pink-400"
          } bg-clip-text text-transparent animate-fade-in`}>
          ${record.moneyAmount}
        </Text>

        <View className="space-y-6">
          <View className="flex-row justify-between items-center py-4 border-b transition-colors duration-200 border-gray-100/50 dark:border-gray-700/50 hover:border-primary/50">
            <Text className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Type
            </Text>
            <Text className="text-xl font-semibold text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:text-primary">
              {record.type === "income" ? "Income" : "Expense"}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-4 border-b transition-colors duration-200 border-gray-100/50 dark:border-gray-700/50 hover:border-primary/50">
            <Text className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Category
            </Text>
            <Text className="text-xl font-semibold text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:text-primary">
              {record.category}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-4 border-b transition-colors duration-200 border-gray-100/50 dark:border-gray-700/50 hover:border-primary/50">
            <Text className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Date
            </Text>
            <Text className="text-xl font-semibold text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:text-primary">
              {formatDate(record.createAt)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-4 border-b transition-colors duration-200 border-gray-100/50 dark:border-gray-700/50 hover:border-primary/50">
            <Text className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Payment Method
            </Text>
            <Text className="text-xl font-semibold text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:text-primary">
              {record.paymentMethod}
            </Text>
          </View>

          <View className="flex-row justify-between items-center py-4 border-b transition-colors duration-200 border-gray-100/50 dark:border-gray-700/50 hover:border-primary/50">
            <Text className="text-xl font-medium text-gray-600 dark:text-gray-400">
              Location
            </Text>
            <Text className="text-xl font-semibold text-gray-800 transition-colors duration-200 dark:text-gray-200 hover:text-primary">
              {record.location || "N/A"}
            </Text>
          </View>

          {record.comment && (
            <View className="p-6 mt-8 rounded-xl backdrop-blur-sm transition-all duration-300 ease-in-out bg-gray-50/80 dark:bg-gray-900/80 hover:shadow-lg">
              <Text className="mb-4 text-xl font-medium text-gray-600 dark:text-gray-400">
                Comment
              </Text>
              <Text className="text-xl leading-relaxed text-gray-800 dark:text-gray-200">
                {record.comment}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row justify-between px-4 mt-8">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(func)/editRecord",
              params: { id: record.$id },
            })
          }
          className="px-8 py-4 bg-green-600 rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-green-500 w-[45%]">
          <Text className="text-lg font-semibold text-center text-white">
            更新
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Alert.alert("确认删除", "确定要删除这条记录吗？", [
              {
                text: "取消",
                style: "cancel",
              },
              {
                text: "确定",
                style: "destructive",
                onPress: async () => {
                  try {
                    await deleteRecord(record.$id);
                    router.back();
                  } catch (error) {
                    console.error("删除记录失败:", error);
                    Alert.alert("错误", "删除记录失败，请重试");
                  }
                },
              },
            ]);
          }}
          className="px-8 py-4 bg-red-600 rounded-lg shadow-lg transition duration-200 ease-in-out hover:bg-red-500 w-[45%]">
          <Text className="text-lg font-semibold text-center text-white">
            删除
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RecordDetail;
