import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { createRecord } from "../../services/recordService";
import { StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";

const EXPENSE_CATEGORIES = [
  { label: "餐饮", value: "餐饮" },
  { label: "交通", value: "交通" },
  { label: "购物", value: "购物" },
  { label: "娱乐", value: "娱乐" },
  { label: "居住", value: "居住" },
  { label: "医疗", value: "医疗" },
  { label: "教育", value: "教育" },
  { label: "其他", value: "其他" },
];

const INCOME_CATEGORIES = [
  { label: "工资", value: "工资" },
  { label: "副业", value: "副业" },
  { label: "投资", value: "投资" },
  { label: "奖金", value: "奖金" },
  { label: "其他", value: "其他" },
];

const Record = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [record, setRecord] = useState({
    userId: "",
    moneyAmount: "",
    type: "expense" as "income" | "expense",
    category: "",
    paymentMethod: "",
    tags: "",
    location: "",
    recurring: false,
    comment: "",
  });

  // 获取用户ID
  React.useEffect(() => {
    const getUserId = async () => {
      try {
        const email = await StorageService.getEmail();
        if (email) {
          const userInfo = await getUserByEmail(email);
          setRecord((prev) => ({ ...prev, userId: userInfo.$id }));
        }
      } catch (error) {
        console.error("获取用户ID失败:", error);
      }
    };
    getUserId();
  }, []);

  const handleSubmit = async () => {
    try {
      if (!record.moneyAmount || !record.category) {
        alert("请填写金额和类别");
        return;
      }
      const newRecord = await createRecord({
        ...record,
        moneyAmount: parseFloat(record.moneyAmount),
        tags: record.tags.split(",").filter(Boolean).join(","),
      });
      alert("记录创建成功");
      // 清空表单
      setRecord({
        ...record,
        moneyAmount: "",
        category: "",
        paymentMethod: "",
        tags: "",
        location: "",
        comment: "",
      });
    } catch (error) {
      console.error("创建记录失败:", error);
      alert("创建记录失败，请重试");
    }
  };

  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-quaternary" : "bg-gray-100"}`}>
      <View className="p-5">
        <Text
          className={`text-2xl font-bold mb-5 text-center ${
            isDark ? "text-gray-200" : "text-gray-800"
          }`}>
          记账
        </Text>

        {/* 金额输入 */}
        <View
          className={`mb-4 ${
            isDark ? "bg-quaternary" : "bg-white"
          } rounded-xl p-4`}>
          <Text
            className={`mb-2 text-base font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
            金额
          </Text>
          <View className="flex-row items-center p-3 bg-white rounded-lg">
            <Text
              className={`text-xl mr-2 font-medium ${
                isDark ? "text-gray-200" : "text-gray-700"
              }`}>
              ¥
            </Text>
            <TextInput
              className={`flex-1 text-base ${
                isDark ? "text-gray-200 bg-gray-700" : "text-gray-800 bg-white"
              }`}
              placeholder="0.00"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
              keyboardType="numeric"
              value={record.moneyAmount}
              onChangeText={(value) =>
                setRecord({ ...record, moneyAmount: value })
              }
            />
          </View>
        </View>

        {/* 类型选择 */}
        <View
          className={`mb-4 ${
            isDark ? "bg-quaternary" : "bg-white"
          } rounded-xl p-4`}>
          <Text
            className={`mb-2 text-base font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
            类型
          </Text>
          <View className="overflow-hidden bg-white rounded-lg">
            <Picker
              selectedValue={record.type}
              onValueChange={(value) => setRecord({ ...record, type: value })}
              className={`h-12 ${
                isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
              }`}>
              <Picker.Item
                label="支出"
                value="expense"
                color={isDark ? "#EF4444" : "#DC2626"}
              />
              <Picker.Item
                label="收入"
                value="income"
                color={isDark ? "#10B981" : "#059669"}
              />
            </Picker>
          </View>
        </View>

        {/* 类别选择 */}
        <View
          className={`mb-4 ${
            isDark ? "bg-quaternary" : "bg-white"
          } rounded-xl p-4`}>
          <Text
            className={`mb-2 text-base font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
            类别
          </Text>
          <View className="overflow-hidden bg-white rounded-lg">
            <Picker
              selectedValue={record.category}
              onValueChange={(value) =>
                setRecord({ ...record, category: value })
              }
              className={`h-12 ${
                isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
              }`}>
              <Picker.Item
                label="选择类别"
                value=""
                color={isDark ? "#9CA3AF" : "#6B7280"}
              />
              {(record.type === "expense"
                ? EXPENSE_CATEGORIES
                : INCOME_CATEGORIES
              ).map((category) => (
                <Picker.Item
                  key={category.value}
                  label={category.label}
                  value={category.value}
                  color={isDark ? "#E5E7EB" : "#1F2937"}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* 支付方式 */}
        <View
          className={`mb-4 ${
            isDark ? "bg-quaternary" : "bg-white"
          } rounded-xl p-4`}>
          <Text
            className={`mb-2 text-base font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
            支付方式
          </Text>
          <TextInput
            className={`p-3 rounded-lg text-base ${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
            }`}
            placeholder="现金/支付宝/微信"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={record.paymentMethod}
            onChangeText={(value) =>
              setRecord({ ...record, paymentMethod: value })
            }
          />
        </View>

        {/* 地点输入 */}
        <View
          className={`mb-4 ${
            isDark ? "bg-quaternary" : "bg-white"
          } rounded-xl p-4`}>
          <Text
            className={`mb-2 text-base font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
            地点
          </Text>
          <TextInput
            className={`p-3 rounded-lg text-base ${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
            }`}
            placeholder="输入消费地点"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={record.location}
            onChangeText={(value) => setRecord({ ...record, location: value })}
          />
        </View>

        {/* 标签 */}
        <View
          className={`mb-4 ${
            isDark ? "bg-quaternary" : "bg-white"
          } rounded-xl p-4`}>
          <Text
            className={`mb-2 text-base font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
            标签
          </Text>
          <TextInput
            className={`p-3 rounded-lg text-base ${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
            }`}
            placeholder="多个标签用逗号分隔"
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={record.tags}
            onChangeText={(value) => setRecord({ ...record, tags: value })}
          />
        </View>

        {/* 备注 */}
        <View
          className={`mb-4 ${
            isDark ? "bg-quaternary" : "bg-white"
          } rounded-xl p-4`}>
          <Text
            className={`mb-2 text-base font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            }`}>
            备注
          </Text>
          <TextInput
            className={`p-3 rounded-lg text-base ${
              isDark ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800"
            }`}
            placeholder="添加备注..."
            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            value={record.comment}
            onChangeText={(value) => setRecord({ ...record, comment: value })}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* 提交按钮 */}
        <TouchableOpacity
          onPress={handleSubmit}
          className={`p-4 rounded-xl mb-6 mt-2 ${
            isDark ? "bg-blue-700" : "bg-blue-500"
          }`}>
          <Text className="text-base font-semibold text-center text-white">
            保存记录
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Record;
