/*
 * @Date: 2025-04-01 16:52:58
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-01 17:35:10
 * @FilePath: /Money_Recorder/app/(profile)/user-agreement.tsx
 */
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Stack } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UserAgreement() {
  const { translations } = useLanguage();

  return (
    <View className="mt-20 flex-1 bg-white dark:bg-gray-900">
      <Stack.Screen options={{ title: "用户协议" }} />
      <ScrollView className="p-4">
        <Text className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          {translations.agreement.title}
        </Text>

        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.agreement.first}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.agreement.title2}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.agreement.second}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.agreement.title3}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.agreement.third}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.agreement.title4}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.agreement.fourth}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.agreement.title5}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.agreement.fifth}
        </Text>

        <Text className="mb-2 text-base font-semibold text-gray-800 dark:text-gray-200">
          {translations.agreement.title6}
        </Text>
        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.agreement.sixth}
        </Text>

        <Text className="mb-4 text-base text-gray-700 dark:text-gray-300">
          {translations.agreement.date}
        </Text>
      </ScrollView>
    </View>
  );
}
