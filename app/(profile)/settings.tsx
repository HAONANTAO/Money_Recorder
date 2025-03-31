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
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  // 清除缓存函数
  const handleClearCache = async () => {
    Alert.alert(t("clearCache"), t("clearCacheConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("clear"),
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            Alert.alert(t("success"), t("cacheCleared"));
          } catch (error) {
            Alert.alert(t("error"), t("cacheClearFailed"));
          }
        },
        style: "destructive",
      },
    ]);
  };

  // 打开通知设置的函数
  const openNotificationSettings = () => {
    Alert.alert(t("notifications"), t("notificationSettings"), [
      {
        text: t("cancel"),
        style: "cancel",
      },
      {
        text: t("openSettings"),
        onPress: () => {
          if (Platform.OS === "ios") {
            // 打开 iOS 设置页面
            Linking.openURL("app-settings:").catch((err) =>
              console.error("Failed to open settings:", err),
            );
          } else {
            Alert.alert(t("notifications"), t("notificationIOSOnly"));
          }
        },
        style: "default",
      },
    ]);
  };

  return (
    <View
      className={`flex-1 ${
        theme === "dark" ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="px-6 py-10">
          <Text
            className={`mb-8 text-3xl font-extrabold text-center ${
              theme === "dark" ? "text-gray-200" : "text-gray-800"
            }`}>
            {t("settings")}
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
                {t("notifications")}
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
                {t("theme")}: {theme === "light" ? t("light") : t("dark")}
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
                {t("clearCache")}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-16">
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
                {t("language")}:{" "}
                {language === "en" ? t("english") : t("chinese")}
              </Text>
            </TouchableOpacity>

            <Text
              className={`text-sm text-center ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
              {t("appVersion")}: 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
