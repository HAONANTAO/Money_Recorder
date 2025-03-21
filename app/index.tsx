/*
 * @Date: 2025-03-21 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-21 20:49:52
 * @FilePath: /Money_Recorder/app/index.tsx
 */
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl text-primary font-bold"> Money_Recorder1</Text>
      <Text className="text-5xl text-secondary font-bold">
        {" "}
        Money_Recorder2
      </Text>
      <Text className="text-5xl text-tertiary font-bold"> Money_Recorder3</Text>
      <Text className="text-5xl text-quaternary font-bold">
        {" "}
        Money_Recorder4
      </Text>
      <Text className="text-5xl text-quinary font-bold"> Money_Recorder5</Text>
    </View>
  );
}
