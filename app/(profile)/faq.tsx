/*
 * @Date: 2025-03-30 15:09:05
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-02 23:25:31
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
    <View
      className={`flex-1 p-4 ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <View className="flex justify-center items-center mb-6">
        <Text
          className={`text-2xl font-bold ${
            theme === "dark" ? "text-white" : "text-quaternary"
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
          <Text className="font-semibold text-white">
            {translations.author.contactMe}
          </Text>
          <View className="right-12 bottom-24">
            <BackButton navigateTo="/(tabs)/profile" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FAQ;
