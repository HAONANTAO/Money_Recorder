/*
 * @Date: 2025-04-01 16:52:37
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-01 17:34:59
 * @FilePath: /Money_Recorder/app/(profile)/privacy-policy.tsx
 */
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPolicy() {
  const { translations } = useLanguage();

  return (
    <View className="mt-20 flex-1 bg-white dark:bg-gray-900">
      <Stack.Screen options={{ title: "隐私政策" }} />
      <ScrollView className="p-4">
        <Text className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          {translations.privacy.title}
        </Text>

        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.privacy.first}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.privacy.title2}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.privacy.second}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.privacy.title3}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.privacy.third}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.privacy.title4}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.privacy.fourth}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.privacy.title5}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.privacy.fifth}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.privacy.title6}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.privacy.sixth}
        </Text>

        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.privacy.date}
        </Text>
      </ScrollView>
    </View>
  );
}
