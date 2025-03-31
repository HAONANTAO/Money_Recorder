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

const Settings = () => {
  // Use the theme context instead of local state
  const { theme, toggleTheme } = useTheme();

  // 清除缓存函数
  const handleClearCache = async () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the cache? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert("Success", "Cache cleared successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to clear cache.");
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  // 打开通知设置的函数
  const openNotificationSettings = () => {
    Alert.alert("Notifications Settings", "Open the Notification settings?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Open Settings",
        onPress: () => {
          if (Platform.OS === "ios") {
            // 打开 iOS 设置页面
            Linking.openURL("app-settings:").catch((err) =>
              console.error("Failed to open settings:", err),
            );
          } else {
            Alert.alert(
              "Notifications",
              "This functionality is only available on iOS.",
            );
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
            Settings
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
                Notifications
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
                Theme: {theme === "light" ? "Light" : "Dark"}
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
                Clear Cache
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-16">
            <Text
              className={`text-sm text-center ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}>
              App Version: 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
