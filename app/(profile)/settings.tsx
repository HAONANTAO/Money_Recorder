import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // 引入图标库
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import BackButton from "@/components/BackButton";

const Settings = () => {
  // Use the theme context and language context
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, translations } = useLanguage();

  // 清除缓存函数
  const handleClearCache = async () => {
    Alert.alert(
      translations.alerts.clearCache.title,
      translations.alerts.clearCache.message,
      [
        { text: translations.common.cancel, style: "cancel" },
        {
          text: translations.common.clear,
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(
                translations.common.success,
                translations.alerts.clearCache.success,
              );
            } catch (error) {
              Alert.alert(
                translations.common.error,
                translations.alerts.clearCache.error,
              );
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  // 打开通知设置的函数
  const openNotificationSettings = () => {
    Alert.alert(
      translations.alerts.notifications.title,
      translations.alerts.notifications.message,
      [
        {
          text: translations.common.cancel,
          style: "cancel",
        },
        {
          text: translations.common.open,
          onPress: () => {
            if (Platform.OS === "ios") {
              // 打开 iOS 设置页面
              Linking.openURL("app-settings:").catch((err) =>
                console.error("Failed to open settings:", err),
              );
            } else {
              Alert.alert(
                translations.settings.notifications,
                translations.alerts.notifications.iosOnly,
              );
            }
          },
          style: "default",
        },
      ],
    );
  };

  return (
    <View
      className={`flex-1 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <View className="absolute left-4 top-12 z-50">
        <BackButton navigateTo="/(tabs)/profile" />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="px-6 py-10">
          <Text
            className={`mb-8 text-3xl font-extrabold text-center ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}>
            {translations.settings.title}
          </Text>

          <View className="gap-4 space-y-6">
            {/* Notifications 按钮 */}
            <TouchableOpacity
              onPress={openNotificationSettings}
              className={`flex-row items-center p-4 rounded-xl shadow-md ${
                theme === "dark" ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme === "dark" ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}>
                {translations.settings.notifications}
              </Text>
            </TouchableOpacity>

            {/* 主题切换按钮 */}
            <TouchableOpacity
              onPress={toggleTheme} // 使用context中的toggleTheme函数
              className={`flex-row items-center p-4 rounded-xl shadow-md ${
                theme === "dark" ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name={theme === "dark" ? "sunny-outline" : "moon-outline"}
                size={24}
                color={theme === "dark" ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}>
                {translations.settings.theme}:{" "}
                {theme === "light"
                  ? translations.settings.themeLight
                  : translations.settings.themeDark}
              </Text>
            </TouchableOpacity>

            {/* 清除缓存按钮 */}
            <TouchableOpacity
              onPress={handleClearCache}
              className={`flex-row items-center p-4 rounded-xl shadow-md ${
                theme === "dark" ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name="trash-outline"
                size={24}
                color={theme === "dark" ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}>
                {translations.settings.clearCache}
              </Text>
            </TouchableOpacity>

            {/* 语言切换按钮 */}
            <TouchableOpacity
              onPress={() => setLanguage(language === "en" ? "zh" : "en")}
              className={`flex-row items-center p-4 rounded-xl shadow-md ${
                theme === "dark" ? "bg-quaternary" : "bg-white"
              }`}>
              <Ionicons
                name="language-outline"
                size={24}
                color={theme === "dark" ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`ml-4 text-lg font-semibold ${
                  theme === "dark" ? "text-gray-200" : "text-gray-700"
                }`}>
                {translations.settings.language}:{" "}
                {language === "en" ? "English" : "中文"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-16">
            <Text
              className={`text-sm text-center ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
              {translations.settings.version}: 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
