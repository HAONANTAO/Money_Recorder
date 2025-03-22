/*
 * @Date: 2025-03-21 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-22 19:38:39
 * @FilePath: /Money_Recorder/app/_layout.tsx
 */
import { Tabs } from "expo-router";
import "./globals.css";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

// 主页面的基础配置
export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          paddingVertical: 4,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        },
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          marginTop: 4,
        },
        tabBarActiveTintColor: "#1E40AF",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <View className="flex flex-col items-center">
              <Ionicons name="home-outline" size={size} color={color} />
              <Text className="font-bold text-xs" numberOfLines={1}>
                Main
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color, size }) => (
            <View className="flex flex-col items-center">
              <Ionicons name="stats-chart-outline" size={size} color={color} />
              <Text className="font-bold text-xs" numberOfLines={1}>
                Stats
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/record"
        options={{
          title: "Record",
          tabBarIcon: ({ color, size }) => (
            <View className="flex flex-col items-center">
              <Ionicons name="add-circle-outline" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/goals"
        options={{
          title: "Goal",
          tabBarIcon: ({ color, size }) => (
            <View className="flex flex-col items-center">
              <Ionicons name="trophy-outline" size={size} color={color} />
              <Text className="font-bold text-xs" numberOfLines={1}>
                Goal
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="(tabs)/profile"
        options={{
          title: "My",
          tabBarIcon: ({ color, size }) => (
            <View className="flex flex-col items-center">
              <Ionicons name="person-outline" size={size} color={color} />
              <Text className="font-bold text-xs" numberOfLines={1}>
                My
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
