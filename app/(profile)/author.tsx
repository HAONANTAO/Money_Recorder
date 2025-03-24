/*
 * @Date: 2025-03-24 17:05:36
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-24 21:17:54
 * @FilePath: /Money_Recorder/app/(profile)/author.tsx
 */
import { View, Text, Image } from "react-native";
import React from "react";

const Author = () => {
  return (
    <View className="flex-1 justify-center items-center p-6 bg-gray-100">
      {/* 头像 */}
      <Image
        source={require("../../assets/images/Aaron.jpg")}
        className="mb-4 w-36 h-36 rounded-full border-4 shadow-lg border-gray-300"
      />
      {/* 标题 */}
      <Text className="mb-2 text-5xl font-extrabold text-gray-800">
        Aaron Tao
      </Text>

      {/* 简介 */}
      <Text className="px-8 mt-4 text-lg leading-relaxed text-center text-gray-600">
        Hello! I am an IT developer who has studied at Monash and Melbourne
        University. As a passionate developer, I am constantly learning and
        growing, hoping to make achievements in the IT field.
      </Text>

      {/* 精简后的技能展示 */}
      <View className="px-6 mt-6 w-full">
        <Text className="mb-2 text-xl font-semibold text-gray-800">Skills</Text>
        <Text className="leading-loose text-gray-700">
          💻 Web Development: HTML, CSS, JavaScript{"\n"}
          🚀 Frontend Frameworks: React, React Native{"\n"}
          🗄️ Backend: Node.js, MongoDB
        </Text>
      </View>

      {/* 联系方式部分，简化样式 */}
      <Text className="mt-8 text-xl font-semibold text-gray-800">
        Contact Me
      </Text>
      <View className="mt-4 space-y-2">
        <Text className="text-gray-700">📧 Email: taoaaron5@gmail.com</Text>
        <Text className="text-gray-700">🌐 WeChat: aarontao_wechat</Text>
      </View>

      {/* 结束语 */}
      <Text className="mt-8 italic text-center text-gray-600">
        "Building innovative solutions, one project at a time."
      </Text>
    </View>
  );
};

export default Author;
