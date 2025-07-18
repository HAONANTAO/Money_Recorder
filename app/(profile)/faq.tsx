/*
 * @Date: 2025-03-30 15:09:05
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-06 20:32:43
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
import { useLanguage } from "../../contexts/LanguageContext";
import { useState } from "react";
import BackButton from "@/components/BackButton";

const FAQ = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { translations } = useLanguage();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: translations.profile.faqContent.howToRecord.question,
      answer: translations.profile.faqContent.howToRecord.answer,
    },
    {
      question: translations.profile.faqContent.howToViewStats.question,
      answer: translations.profile.faqContent.howToViewStats.answer,
    },
    {
      question: translations.profile.faqContent.howToSetBudget.question,
      answer: translations.profile.faqContent.howToSetBudget.answer,
    },
    {
      question: translations.profile.faqContent.howToSwitchTheme.question,
      answer: translations.profile.faqContent.howToSwitchTheme.answer,
    },
    {
      question: translations.profile.faqContent.howToEditProfile.question,
      answer: translations.profile.faqContent.howToEditProfile.answer,
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View className={`flex-1 p-4 ${isDark ? "bg-quaternary" : "bg-white"}`}>
      <BackButton />
      <View className="flex justify-center items-center mt-24 mb-6">
        <Text
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-quaternary"
          }`}>
          {translations.profile.faq}
        </Text>
      </View>
      <ScrollView className="flex-1 mb-20">
        {faqData.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleExpand(index)}
            className={`mb-4 rounded-lg overflow-hidden ${
              isDark ? "bg-blue-200" : "bg-gray-100"
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
      <View className="absolute right-0 bottom-0 left-0 p-4 mb-4">
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "mailto:taoaaron5@gmail.com?subject=Feedback%20for%20Money%20Recorder",
            )
          }
          className={`flex-row justify-center items-center p-3 rounded-lg ${
            isDark ? "bg-secondary " : "bg-secondary "
          }`}>
          <Text className="font-semibold text-white">
            {translations.author.contactMe}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FAQ;
