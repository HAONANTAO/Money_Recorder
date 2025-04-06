import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
interface RecordShowBoxProps {
  record: MoneyRecord;
}

const RecordShowBox: React.FC<RecordShowBoxProps> = ({ record }) => {
  const { theme } = useTheme();

  const isDark = theme === "dark";
  const { translations, language } = useLanguage();
  const formatDate = (date: Date | string | number) => {
    const locale = language === "zh" ? "zh-CN" : "en-US";
    return new Date(date).toLocaleDateString(locale);
  };

  const handlePress = () => {
    router.push(`/(func)/recordDetail?id=${record.$id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`overflow-hidden p-3 mb-3  rounded-lg border border-blue-200 shadow-md active:opacity-80 `}
      // 直接用 style 固定宽度，防止 NativeWind 某些情况下 w-[48%] 不生效
      style={{ width: "48%" }} // ✅ 固定宽度为 48%
    >
      <View className="w-full">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className={`text-lg font-bold text-ellipsis overflow-hidden ${
            record.type === "income" ? "text-green-500" : "text-red-500"
          } `}>
          {record.type === "income"
            ? translations.record.income
            : translations.record.expense}
          : ${record.moneyAmount}
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="overflow-hidden text-sm text-gray-600 text-ellipsis">
          <Text className="text-secondary">
            {translations.record.category}:
          </Text>
          <Text className={`${isDark ? "text-white" : ""}`}>
            {record.category}
          </Text>
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="overflow-hidden text-sm text-gray-600 dark:text-gray-400 text-ellipsis">
          <Text className="text-secondary">{translations.record.date}: </Text>
          <Text className={`${isDark ? "text-white" : ""}`}>
            {formatDate(record.createAt)}
          </Text>
        </Text>

        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="overflow-hidden text-sm text-gray-600 text-ellipsis">
          <Text className="text-secondary">{translations.record.method}: </Text>
          <Text className={`${isDark ? "text-white" : ""}`}>
            {record.paymentMethod || "N/A"}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecordShowBox;
