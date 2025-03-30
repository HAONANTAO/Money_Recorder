/*
 * @Date: 2025-03-30 15:09:05
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-30 15:35:43
 * @FilePath: /Money_Recorder/app/(profile)/faq.tsx
 */
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";

const FAQ = () => {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "How to record income and expenses?",
      answer:
        'Click the "+" button in the bottom navigation bar, select income or expense type, fill in the amount and notes, then click save to complete the record.',
    },
    {
      question: "How to view statistics?",
      answer:
        'Click the "Stats" button in the bottom navigation bar to view pie charts and bar charts analysis of your income and expenses to understand your financial situation.',
    },
    {
      question: "How to set a budget?",
      answer:
        'Click the "Goal" button on the "Goals" page to set your monthly expense budget. The system will help you track your budget usage.',
    },
    {
      question: "How to switch dark mode?",
      answer:
        'Go to S "My Profile" page then enter the setting site to switch between dark/light theme modes.',
    },
    {
      question: "How to modify personal information?",
      answer:
        'Click the edit button on "My Profile" page to modify your username, avatar and other personal information.',
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
          FAQ
        </Text>
      </View>
      <ScrollView className="flex-1 mb-20">
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
      <View className="absolute right-0 bottom-0 left-0 p-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "mailto:taoaaron5@gmail.com?subject=Feedback%20for%20Money%20Recorder",
            )
          }
          className="flex-row justify-center items-center p-3 rounded-lg bg-secondary">
          <Text className="font-semibold text-white">Contact Developer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FAQ;
