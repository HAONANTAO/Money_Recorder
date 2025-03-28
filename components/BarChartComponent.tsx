/*
 * @Date: 2025-03-28 12:33:05
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-28 12:50:59
 * @FilePath: /Money_Recorder/components/BarChartComponent.tsx
 */
import React from "react";
import { View, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

interface BarChartComponentProps {
  data: {
    name: string;
    population: number;
    icon?: string;
  }[];
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ data }) => {
  const screenWidth = Dimensions.get("window").width; // 动态获取屏幕宽度

  const chartData = {
    labels: data.map((item) => item.icon || item.name),
    datasets: [
      {
        data: data.map((item) => item.population),
      },
    ],
  };

  return (
    <View className="p-4 rounded-2xl border border-gray-200">
      <BarChart
        data={chartData}
        width={screenWidth} // 动态宽度
        height={220}
        yAxisLabel="$" // 如果不需要前缀，留空即可
        fromZero // 图表从 0 开始
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0, // 显示整数
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          barPercentage: 0.5, // 将 barPercentage 移到 chartConfig 中
          style: {
            borderRadius: 16,
            paddingLeft: 10, // paddingLeft 移到 chartConfig.style
          },
        }}
        style={{
          borderRadius: 16,
        }}
      />
    </View>
  );
};

export default BarChartComponent;
