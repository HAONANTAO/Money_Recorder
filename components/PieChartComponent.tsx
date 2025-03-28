import React from "react";
import { View, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";

interface PieChartComponentProps {
  data: any[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
  return (
    <View className="p-4 m-2 rounded-2xl border border-gray-200">
      <PieChart
        data={data}
        width={500}
        height={200}
        chartConfig={{
          backgroundColor: "#000",
          backgroundGradientFrom: "#1E2923",
          backgroundGradientTo: "#08130D",
          decimalPlaces: 2,
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
