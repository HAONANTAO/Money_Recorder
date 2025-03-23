/*
 * @Date: 2025-03-21 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-23 16:12:49
 * @FilePath: /Money_Recorder/app/index.tsx
 */
import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createUser, loginUser } from "@/services/userManagement";

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isLogin) {
        // 处理登录逻辑
        if (!email || !password) {
          throw new Error("Please fill all fields");
        }
        const user = await loginUser(email, password);
        console.log("Login successful:", user);
        setShowSuccessModal(true);
      } else {
        // 处理注册逻辑
        if (!username || !email || !password) {
          throw new Error("Please fill all fields");
        }

        console.log("Register:", { username, email, password: "[REDACTED]" });
        const user = await createUser(username, email, password);
        console.log("Account sign up successfully:", user);

        // 注册成功后切换到登录页面
        setIsLogin(true);
        setUsername("");
        setEmail("");
        setPassword("");
        setShowSuccessModal(true);
      }
    } catch (err) {
      throw new Error("Failed action. pls try again!");
    } finally {
      setLoading(false);
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

      {/* 主要body */}
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
              value={email}
              onChangeText={setEmail}
              className="py-3 pr-4 pl-10 text-gray-800 bg-gray-100 rounded-lg"
              // 自动填充禁用
              autoComplete="off"
              textContentType="none"
              keyboardType="email-address"
            />
          </View>

          {!isLogin && (
            <View className="relative mb-4">
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#9CA3AF"
                style={{ position: "absolute", left: 12, top: 12 }}
              />
              <TextInput
                placeholder="Username..."
                value={username}
                onChangeText={setUsername}
                className="py-3 pr-4 pl-10 text-gray-800 bg-gray-100 rounded-lg"
                autoComplete="off"
                textContentType="none"
              />
            </View>
          )}
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
              autoComplete="off"
              textContentType="none"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="py-3 mt-6 rounded-lg bg-tertiary"
            disabled={loading}>
            {loading ? (
              // 加载器
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-center text-white">
                {isLogin ? "LogIn" : "SignUp"}
              </Text>
            )}
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

      {/* 成功提示Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="items-center p-6 w-4/5 bg-white rounded-2xl">
            <Ionicons name="checkmark-circle" size={60} color="#10B981" />
            <Text className="mt-4 mb-6 text-xl font-bold text-center">
              {isLogin ? "Login successfully!" : "SignUp successfully!"}
            </Text>
            <Text className="mb-6 text-center text-gray-600">
              {isLogin ? "Jump to the main page" : "Jump to the Login page"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowSuccessModal(false);
                // 跳转主页面
                if (isLogin) {
                  router.replace("/(tabs)/home");
                }
              }}
              className="px-8 py-3 w-full rounded-lg bg-tertiary">
              <Text className="font-semibold text-center text-white">
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
