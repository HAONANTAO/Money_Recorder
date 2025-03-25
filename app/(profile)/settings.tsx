import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 引入 AsyncStorage
import { Ionicons } from "@expo/vector-icons"; // 引入图标库

const Settings = () => {
  // 清除缓存函数
  const handleClearCache = async () => {
    Alert.alert(
      "Clear Cache", // 标题
      "Are you sure you want to clear the cache? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          onPress: async () => {
            try {
              await AsyncStorage.clear(); // 清除缓存
              Alert.alert("Success", "Cache cleared successfully!"); // 成功提示
            } catch (error) {
              Alert.alert("Error", "Failed to clear cache."); // 错误提示
            }
          },
          style: "destructive",
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View className="px-6 py-10">
          {/* 标题 */}
          <Text className="mb-8 text-3xl font-extrabold text-center text-gray-800">
            Settings
          </Text>

          {/* 设置列表 */}
          <View className="gap-4 space-y-6">
            <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-xl shadow-md">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#4B5563"
              />
              <Text className="ml-4 text-lg font-semibold text-gray-700">
                Notifications
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-xl shadow-md">
              <Ionicons name="lock-closed-outline" size={24} color="#4B5563" />
              <Text className="ml-4 text-lg font-semibold text-gray-700">
                Privacy Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-xl shadow-md">
              <Ionicons name="moon-outline" size={24} color="#4B5563" />
              <Text className="ml-4 text-lg font-semibold text-gray-700">
                Theme: Light/Dark
              </Text>
            </TouchableOpacity>

            {/* Clear Cache 按钮 */}
            <TouchableOpacity
              onPress={handleClearCache} // 添加点击事件
              className="flex-row items-center p-4 bg-white rounded-xl shadow-md">
              <Ionicons name="trash-outline" size={24} color="#4B5563" />
              <Text className="ml-4 text-lg font-semibold text-gray-700">
                Clear Cache
              </Text>
            </TouchableOpacity>
          </View>

          {/* 底部版本信息 */}
          <View className="mt-16">
            <Text className="text-sm text-center text-gray-500">
              App Version: 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
