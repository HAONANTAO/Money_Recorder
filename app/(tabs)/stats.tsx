import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";
import RecordShowBox from "@/components/RecordShowbox";
import DateChecker from "@/utils/dateChecker";
import PieChartComponent from "@/components/PieChartComponent"; // Import the PieChartComponent

const EXPENSE_CATEGORIES = [
  { label: "Eating", value: "eating", icon: "🍔" },
  { label: "Traffic", value: "traffic", icon: "🚗" },
  { label: "Shopping", value: "shopping", icon: "🛍️" },
  { label: "Entertainment", value: "entertainment", icon: "🎮" },
  { label: "Living", value: "living", icon: "🏠" },
  { label: "Medication", value: "medication", icon: "💊" },
  { label: "Education", value: "education", icon: "🎓" },
  { label: "Others", value: "others", icon: "🌍" },
];

const Stats = () => {
  const { theme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [eventLength, setEventLength] = useState<number>(0);

  const [expenseCategories, setExpenseCategories] = useState<any[]>([]);

  useEffect(() => {
    const getInit = async () => {
      try {
        const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
        if (!email) return;

        const userData = await getUserByEmail(email);
        const [user, records] = await Promise.all([
          getUserByEmail(email),
          getRecords(userData.$id),
        ]);

        setUser(user);
        const filteredRecords = DateChecker(
          records as unknown as MoneyRecord[],
        );
        setRecords(filteredRecords);
        setEventLength(records.length);

        const incomeTotal = filteredRecords
          .filter((record: any) => record.type === "income")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        const expenseTotal = filteredRecords
          .filter((record: any) => record.type === "expense")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        setIncome(incomeTotal);
        setExpense(expenseTotal);

        const categoryData = filteredRecords
          .filter((record: any) => record.type === "expense")
          .reduce((categories: any, record: any) => {
            const category = record.category;
            if (categories[category]) {
              categories[category] += record.moneyAmount;
            } else {
              categories[category] = record.moneyAmount;
            }
            return categories;
          }, {});

        const pieChartData = EXPENSE_CATEGORIES.map((category) => ({
          name: category.label,
          population: categoryData[category.value] || 0,
          color: getRandomColor(),
          legendFontColor: "#7f7f7f",
          legendFontSize: 15,
        }));

        setExpenseCategories(pieChartData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user or records:", error);
        setLoading(false);
      }
    };

    getInit();
  }, []);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <View
      className={`flex-1 justify-start items-center ${
        theme === "dark" ? "bg-quaternary" : "bg-white"
      }`}>
      <Text className="mt-20 text-4xl font-bold text-primary">
        Stats Overview
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <View className="p-4">
            <Text className="text-xl font-semibold">
              Total Event: {eventLength}
            </Text>
            <Text className="text-xl font-semibold">
              Total Income: ${income}
            </Text>
            <Text className="text-xl font-semibold">
              Total Expense: ${expense}
            </Text>
          </View>

          {/* Use the PieChartComponent here */}
          <PieChartComponent data={expenseCategories} />

          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            className="p-4 m-2 rounded-2xl border border-gray-200">
            <View className="flex flex-row flex-wrap justify-around">
              {records.length > 0 ? (
                records.map((record: any) => (
                  <View className="p-2 w-1/2" key={record.$id}>
                    <RecordShowBox record={record} />
                  </View>
                ))
              ) : (
                <Text>No records found</Text>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Stats;
