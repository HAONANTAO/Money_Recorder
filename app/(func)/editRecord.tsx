/*
 * @Date: 2025-03-29 16:31:38
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-29 16:31:41
 * @FilePath: /Money_Recorder/app/(func)/editRecord.tsx
 */
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { getRecordById, updateRecord } from "@/services/recordService";
import { useTheme } from "../../contexts/ThemeContext";

const EditRecord = () => {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams();
  const [record, setRecord] = useState<MoneyRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    moneyAmount: "",
    type: "",
    category: "",
    paymentMethod: "",
    location: "",
    comment: "",
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const recordData = await getRecordById(id as string);
        setRecord(recordData as unknown as MoneyRecord);
        setFormData({
          moneyAmount: recordData.moneyAmount.toString(),
          type: recordData.type,
          category: recordData.category,
          paymentMethod: recordData.paymentMethod,
          location: recordData.location || "",
          comment: recordData.comment || "",
        });
      } catch (error) {
        console.error("Error fetching record:", error);
        Alert.alert("错误", "获取记录失败");
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  const handleUpdate = async () => {
    try {
      if (!record) return;

      const updatedRecord = {
        ...record,
        ...formData,
        moneyAmount: parseFloat(formData.moneyAmount),
      };

      // 从 updatedRecord 中排除 $id、userId 和 createAt 字段
      const { $id, userId, createAt, ...updateData } = updatedRecord;
      // 确保 type 字段的值为 'income' 或 'expense'
      const validatedData = {
        ...updateData,
        type: updateData.type as "income" | "expense",
      };
      await updateRecord(record.$id, validatedData);
      Alert.alert("成功", "记录已更新", [
        {
          text: "确定",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating record:", error);
      Alert.alert("错误", "更新记录失败");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 p-4 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <View className="space-y-4">
        <View>
          <Text className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            金额
          </Text>
          <TextInput
            value={formData.moneyAmount}
            onChangeText={(text) =>
              setFormData({ ...formData, moneyAmount: text })
            }
            keyboardType="numeric"
            className="p-3 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
          />
        </View>

        <View>
          <Text className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            类型
          </Text>
          <TextInput
            value={formData.type}
            onChangeText={(text) => setFormData({ ...formData, type: text })}
            className="p-3 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
          />
        </View>

        <View>
          <Text className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            类别
          </Text>
          <TextInput
            value={formData.category}
            onChangeText={(text) =>
              setFormData({ ...formData, category: text })
            }
            className="p-3 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
          />
        </View>

        <View>
          <Text className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            支付方式
          </Text>
          <TextInput
            value={formData.paymentMethod}
            onChangeText={(text) =>
              setFormData({ ...formData, paymentMethod: text })
            }
            className="p-3 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
          />
        </View>

        <View>
          <Text className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            位置
          </Text>
          <TextInput
            value={formData.location}
            onChangeText={(text) =>
              setFormData({ ...formData, location: text })
            }
            className="p-3 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
          />
        </View>

        <View>
          <Text className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            备注
          </Text>
          <TextInput
            value={formData.comment}
            onChangeText={(text) => setFormData({ ...formData, comment: text })}
            multiline
            numberOfLines={4}
            className="p-3 bg-white rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
          />
        </View>

        <TouchableOpacity
          onPress={handleUpdate}
          className="px-6 py-3 mt-6 bg-blue-600 rounded-lg">
          <Text className="text-lg font-semibold text-center text-white">
            保存更新
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditRecord;
