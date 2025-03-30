/*
 * @Date: 2025-03-30 15:09:05
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-30 15:09:05
 * @FilePath: /Money_Recorder/app/(profile)/faq.tsx
 */
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";

const FAQ = () => {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "如何记录收支？",
      answer:
        '在底部导航栏点击"记录"按钮，选择收入或支出类型，填写金额和备注信息，然后点击保存即可完成记录。',
    },
    {
      question: "如何查看统计数据？",
      answer:
        '在底部导航栏点击"统计"按钮，可以查看收支的饼图和柱状图分析，了解您的财务状况。',
    },
    {
      question: "如何设置预算？",
      answer:
        '在"目标"页面中点击"预算"按钮，可以设置每月的支出预算，系统会帮助您追踪预算使用情况。',
    },
    {
      question: "如何切换深色模式？",
      answer: '在"我的"页面中点击设置，可以选择切换深色/浅色主题模式。',
    },
    {
      question: "如何修改个人信息？",
      answer: '在"我的"页面中点击编辑按钮，可以修改用户名和头像等个人信息。',
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View
      className={`flex-1 p-4 ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <View className="flex justify-center items-center mb-6">
        <Text
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-quaternary"
          }`}>
          常见问题
        </Text>
      </View>
      <ScrollView className="flex-1">
        {faqData.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleExpand(index)}
            className={`mb-4 rounded-lg overflow-hidden ${
              theme === "dark" ? "bg-blue-200" : "bg-gray-100"
            }`}>
            <View className="p-4">
              <Text className="text-lg font-semibold text-quaternary">
                {item.question}
              </Text>
              {expandedIndex === index && (
                <Text className="mt-2 text-gray-600">{item.answer}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FAQ;
