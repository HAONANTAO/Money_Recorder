import { View, Text } from "react-native";
import React from "react";

const More = () => {
  return (
    <View className="flex-1 justify-center items-center p-6 bg-gray-100">
      <Text className="text-4xl font-bold text-primary">More</Text>

      {/* 主要内容区 */}
      <View className="px-6 py-4 mt-10 w-full bg-white rounded-lg shadow-lg">
        <Text className="mb-4 text-xl font-semibold text-quaternary">
          🚧 Under Development 🚧
        </Text>
        <Text className="text-center text-gray-600">
          We're working on bringing you more features. Stay tuned!
        </Text>
      </View>

      {/* 开发提示 */}
      <View className="absolute bottom-5 w-full text-center">
        <Text className="text-sm text-gray-500">
          More features coming soon!
        </Text>
      </View>
    </View>
  );
};

export default More;
