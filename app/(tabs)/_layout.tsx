/*
 * @Date: 2025-03-21 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 22:41:28
 * @FilePath: /Money_Recorder/app/(tabs)/_layout.tsx
 */
import { Stack, Tabs } from "expo-router";
import ".././globals.css";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
// 主页面的基础配置
export default function RootLayout() {
  return (
    <SafeAreaProvider>
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
        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons name="home-outline" size={size} color={color} />
                <Text className="text-xs font-bold" numberOfLines={1}>
                  Main
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="stats"
          options={{
            title: "Stats",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons
                  name="stats-chart-outline"
                  size={size}
                  color={color}
                />
                <Text className="text-xs font-bold" numberOfLines={1}>
                  Stats
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="record"
          options={{
            title: "Record",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons name="add-circle-outline" size={size} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: "Goal",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons name="trophy-outline" size={size} color={color} />
                <Text className="text-xs font-bold" numberOfLines={1}>
                  Goal
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "My",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <View className="flex flex-col items-center">
                <Ionicons name="person-outline" size={size} color={color} />
                <Text className="text-xs font-bold" numberOfLines={1}>
                  My
                </Text>
              </View>
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
