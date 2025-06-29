import { View, Text, Image, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import BackButton from "@/components/BackButton";

const Author = () => {
  // 动画值
  const fadeAnim = useRef(new Animated.Value(0)).current; // 渐显动画
  const scaleAnim = useRef(new Animated.Value(0)).current; // 放大动画
  const bounceAnim = useRef(new Animated.Value(0)).current; // 小人上下移动动画

  useEffect(() => {
    // 同时执行渐显和缩放动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    // 上下移动的小人动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 10, // 上移的高度
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0, // 恢复到原始位置
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { translations } = useLanguage();
  return (
    <View
      className={`flex-1 justify-center items-center p-6 ${
        isDark ? "bg-quaternary" : "bg-gray-100"
      }`}>
      <BackButton navigateTo="/(tabs)/profile" />
      {/* 头像带放大和透明度动画 */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }}>
        <Image
          source={require("../../assets/images/Aaron.jpg")}
          className="mb-4 w-36 h-36 rounded-full border-4 border-gray-300 shadow-lg"
        />
      </Animated.View>

      {/* 标题带滑入效果 */}
      <Animated.Text
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: scaleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        }}
        className="mb-2 text-5xl font-extrabold text-secondary">
        Aaron Tao
      </Animated.Text>

      {/* 动画小人 */}
      <Animated.View
        style={{
          transform: [{ translateY: bounceAnim }],
          marginBottom: 20,
        }}>
        <Text className="text-3xl">🚶‍♂️</Text>
      </Animated.View>

      {/* 简介 */}
      <Text
        className={`${
          isDark ? "text-quinary" : "text-gray-600"
        } px-8 mt-4 text-lg leading-relaxed text-center `}>
        {translations.author.introduction}
      </Text>

      {/* 技能展示部分，添加渐显动画 */}
      {/* 精简后的技能展示，带淡入效果 */}

      {/* 联系方式部分，淡入效果 */}
      <Text className="mt-36 text-3xl font-semibold text-secondary">
        {translations.author.contactMe}
      </Text>
      <Animated.View style={{ opacity: fadeAnim }} className="mt-4 space-y-2">
        <Text className="text-lg text-gray-700">
          <Text
            className={`${
              isDark ? "text-primary" : "text-quaternary"
            } font-bold `}>
            📧 Email:
          </Text>
          <Text className={`${isDark ? "text-quinary" : "text-gray-600"}`}>
            {" "}
            taoaaron5@gmail.com
          </Text>
        </Text>
        <Text className="text-lg text-gray-700">
          <Text
            className={`${
              isDark ? "text-primary" : "text-quaternary"
            } font-bold `}>
            🌐 WeChat:
          </Text>{" "}
          <Text className={`${isDark ? "text-quinary" : "text-gray-600"}`}>
            {" "}
            taohaonan001
          </Text>
        </Text>
      </Animated.View>

      {/* 结束语，带轻微淡入 */}
      <View className="absolute bottom-8 w-full">
        <Animated.Text
          style={{ opacity: fadeAnim }}
          className={`mt-8 italic font-bold text-center  text-[12px] ${
            isDark ? "text-black" : "text-gray-600"
          } `}>
          {translations.author.motto}
        </Animated.Text>
      </View>
    </View>
  );
};

export default Author;
