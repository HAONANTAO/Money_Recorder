import React from "react";
import { View, Text } from "react-native";
import { PieChart } from "react-native-chart-kit";

interface PieChartComponentProps {
  data: any[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
  return (
    <View className="p-4 m-2 rounded-2xl border border-gray-200">
      <PieChart
        data={data}
        width={350} // Set the chart width
        height={200} // Set the chart height
        chartConfig={{
          backgroundColor: "#000",
          backgroundGradientFrom: "#1E2923",
          backgroundGradientTo: "#08130D",
          decimalPlaces: 2, // Precision
          color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
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
