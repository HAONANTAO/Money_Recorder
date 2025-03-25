/*
 * @Date: 2025-03-21 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-24 21:57:06
 * @FilePath: /Money_Recorder/app/(tabs)/_layout.tsx
 */
import { Stack, Tabs } from "expo-router";
import ".././globals.css";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "../../contexts/ThemeContext";
// 主页面的基础配置
export default function RootLayout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: isDark ? "#171717" : "#FFFFFF",
            paddingVertical: 4,
            borderTopWidth: 1,
            borderTopColor: isDark ? "#333333" : "#E5E7EB",
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
          tabBarActiveTintColor: isDark ? "#60A5FA" : "#1647ea",
          tabBarInactiveTintColor: isDark ? "#6B7280" : "#D1D5DB",
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
                <Ionicons
                  name="add-circle-outline"
                  size={size * 1.3}
                  color={color}
                  style={{ marginBottom: -4 }} // 减小负值，调整图标与标签之间的距离
                />
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
