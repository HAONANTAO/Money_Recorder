/*
 * @Date: 2025-03-21 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-22 19:54:09
 * @FilePath: /Money_Recorder/app/index.tsx
 */
import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (isLogin) {
      // 处理登录逻辑
      console.log("Login:", { username, password });
    } else {
      // 处理注册逻辑
      console.log("Register:", { username, password, confirmPassword });
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Image source={require("../assets/images/HomeTitle.png")} />
      <Text className="text-3xl font-bold text-center text-secondary mb-16 mt-6 justify-center">
        The Money-Recorder
      </Text>
      <Text className="text-lg font-extrabold text-center text-secondary mb-12  justify-center">
        Start to record the money you spent and earned every day.
      </Text>
      <View className="w-full max-w-sm">
        {/* 标题 */}
        <Text className="text-3xl font-bold text-center text-quaternary mb-8">
          {isLogin ? "Log in" : "Create the Account"}
        </Text>

        {/* 切换按钮 */}
        <View className="flex-row justify-center mb-8">
          <TouchableOpacity
            onPress={() => setIsLogin(true)}
            className={`px-6 py-2 rounded-l-full ${
              isLogin ? "bg-primary" : "bg-gray-200"
            }`}>
            <Text className={isLogin ? "text-white" : "text-gray-600"}>
              登录
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsLogin(false)}
            className={`px-6 py-2 rounded-r-full ${
              !isLogin ? "bg-primary" : "bg-gray-200"
            }`}>
            <Text className={!isLogin ? "text-white" : "text-gray-600"}>
              注册
            </Text>
          </TouchableOpacity>
        </View>

        {/* 表单 */}
        <View className="space-y-4">
          <View className="relative">
            <Ionicons
              name="person-outline"
              size={20}
              color="#9CA3AF"
              style={{ position: "absolute", left: 12, top: 12 }}
            />
            <TextInput
              placeholder="用户名"
              value={username}
              onChangeText={setUsername}
              className="bg-gray-100 rounded-lg pl-10 pr-4 py-3 text-gray-800"
            />
          </View>

          <View className="relative">
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9CA3AF"
              style={{ position: "absolute", left: 12, top: 12 }}
            />
            <TextInput
              placeholder="密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="bg-gray-100 rounded-lg pl-10 pr-4 py-3 text-gray-800"
            />
          </View>

          {!isLogin && (
            <View className="relative">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#9CA3AF"
                style={{ position: "absolute", left: 12, top: 12 }}
              />
              <TextInput
                placeholder="确认密码"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="bg-gray-100 rounded-lg pl-10 pr-4 py-3 text-gray-800"
              />
            </View>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-primary rounded-lg py-3 mt-6">
            <Text className="text-white text-center font-semibold">
              {isLogin ? "登录" : "注册"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
