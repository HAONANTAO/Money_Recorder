/*
 * @Date: 2025-03-21 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 15:01:18
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
    <View className="flex-1 justify-center items-center p-6 bg-white">
      {/* 背景图片 */}
      <View className="absolute inset-0 z-0">
        <Image
          source={require("../assets/images/Background.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      {/* 主题和图片+介绍 */}
      <Image source={require("../assets/images/HomeTitle.png")} />
      <Text className="justify-center mt-6 mb-16 text-3xl font-bold text-center text-secondary">
        The Money-Recorder
      </Text>
      <Text className="justify-center mb-12 text-lg font-extrabold text-center text-secondary">
        Start to record the money you spent and earned every day.
      </Text>
      <View className="w-full max-w-sm">
        {/* 切换显示*/}
        <Text className="mb-8 text-3xl font-bold text-center text-quaternary">
          {isLogin ? "Log-In" : "Sign-Up"}
        </Text>

        {/* 用户名密码表单 */}
        <View className="space-y-4">
          <View className="relative mb-4">
            <Ionicons
              name="person-outline"
              size={20}
              color="#9CA3AF"
              style={{ position: "absolute", left: 12, top: 12 }}
            />
            <TextInput
              placeholder="Email..."
              value={username}
              onChangeText={setUsername}
              className="py-3 pr-4 pl-10 text-gray-800 bg-gray-100 rounded-lg"
            />
          </View>

          <View className="relative mb-4">
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9CA3AF"
              style={{ position: "absolute", left: 12, top: 12 }}
            />
            <TextInput
              placeholder="Password..."
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              className="py-3 pr-4 pl-10 text-gray-800 bg-gray-100 rounded-lg"
            />
          </View>

          {/* 二次检查输入的密码 */}
          {/* {!isLogin && (
            <View className="relative">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#9CA3AF"
                style={{ position: "absolute", left: 12, top: 12 }}
              />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="py-3 pr-4 pl-10 text-gray-800 bg-gray-100 rounded-lg"
              />
            </View>
          )} */}

          <TouchableOpacity
            onPress={handleSubmit}
            className="py-3 mt-6 rounded-lg bg-primary">
            <Text className="font-semibold text-center text-white">
              {isLogin ? "LogIn" : "SignUp"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* 切换按钮 */}
        {isLogin ? (
          <View className="flex-row justify-center mt-6 mb-8">
            <TouchableOpacity onPress={() => setIsLogin(false)}>
              <Text className="text-secondary">Don't have an account?</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row justify-center mt-6 mb-8">
            <TouchableOpacity onPress={() => setIsLogin(true)}>
              <Text className="text-secondary">Already have an account?</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
