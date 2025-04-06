/*
 * @Date: 2025-04-01 00:16:19
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-06 18:35:13
 * @FilePath: /Money_Recorder/components/PieChartComponent.tsx
 */
import React from "react";
import { View, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { useTheme } from "../contexts/ThemeContext";

interface PieChartComponentProps {
  data: any[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      className={`p-4 m-2 rounded-2xl border ${
        isDark ? "border-gray-600" : "border-gray-200"
      }`}>
      <PieChart
        data={data}
        width={500}
        height={200}
        chartConfig={{
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          backgroundGradientFrom: isDark ? "#374151" : "#f3f4f6",
          backgroundGradientTo: isDark ? "#1f2937" : "#ffffff",
          decimalPlaces: 2,
          color: (opacity = 1) =>
            isDark
              ? `rgba(147, 197, 253, ${opacity})`
              : `rgba(59, 130, 246, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"15"}
      />
    </View>
  );
};

export default PieChartComponent;
