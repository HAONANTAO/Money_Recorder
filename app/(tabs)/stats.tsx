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
import { PieChart } from "react-native-chart-kit"; // 引入饼图

import DateChecker from "@/utils/dateChecker";

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
  const [loading, setLoading] = useState<boolean>(true); // 初始化加载状态为 true

  const [income, setIncome] = useState<number>(0); // 收入总和
  const [expense, setExpense] = useState<number>(0); // 支出总和
  const [eventLength, setEventLength] = useState<number>(0); // 净资产

  const [expenseCategories, setExpenseCategories] = useState<any[]>([]); // 支出分类的数据

  useEffect(() => {
    const getInit = async () => {
      try {
        const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
        if (!email) return;

        const userData = await getUserByEmail(email);
        // 一起完成
        const [user, records] = await Promise.all([
          getUserByEmail(email),
          getRecords(userData.$id),
        ]);

        setUser(user);

        // 检查必须要是这个月的
        const filteredRecords = DateChecker(
          records as unknown as MoneyRecord[],
        );

        setRecords(filteredRecords);
        setEventLength(records.length);
        // 计算收入和支出
        const incomeTotal = filteredRecords
          .filter((record: any) => record.type === "income")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        const expenseTotal = filteredRecords
          .filter((record: any) => record.type === "expense")
          .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

        setIncome(incomeTotal); // 设置收入总和
        setExpense(expenseTotal); // 设置支出总和

        // 分类支出数据
        const categoryData = filteredRecords
          .filter((record: any) => record.type === "expense") // 第一步：过滤出支出记录
          .reduce((categories: any, record: any) => {
            // 第二步：通过 reduce 进行分类统计
            const category = record.category; // 获取当前记录的分类
            if (categories[category]) {
              // 如果当前分类已经存在于 categories 中
              categories[category] += record.moneyAmount; // 将该分类的金额加到现有金额上
            } else {
              categories[category] = record.moneyAmount; // 如果该分类不存在，初始化该分类并赋值金额
            }
            return categories; // 返回更新后的 categories 对象
          }, {}); // 初始值是一个空对象（{}），用于存储各个分类的总金额

        // 转换为图表数据
        const pieChartData = EXPENSE_CATEGORIES.map((category) => ({
          name: category.label,
          population: categoryData[category.value] || 0, // 如果没有该分类的记录，默认为 0
          color: getRandomColor(),
          legendFontColor: "#7f7f7f",
          legendFontSize: 15,
        }));

        setExpenseCategories(pieChartData); // 设置支出分类数据

        setLoading(false); // 数据加载完成后设置加载状态为 false
      } catch (error) {
        console.error("Error fetching user or records:", error);
        setLoading(false); // 即使出错，也应该停止加载状态
      }
    };

    getInit();
  }, []);

  // 随机生成颜色的函数
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <>
      <View
        className={`flex-1 justify-start items-center ${
          theme === "dark" ? "bg-quaternary" : "bg-white"
        }`}>
        {/* title */}
        <Text className="mt-20 text-4xl font-bold text-primary">
          Stats Overview
        </Text>

        {/* 显示加载器 */}
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

            {/* 饼图展示支出分类 */}
            <View className="p-4 m-2 rounded-2xl border border-gray-200">
              <Text className="mb-4 text-xl font-semibold">
                Expense Categories
              </Text>
              <PieChart
                data={expenseCategories}
                width={350} // 设置图表的宽度
                height={250} // 设置图表的高度
                chartConfig={{
                  backgroundColor: "#000",
                  backgroundGradientFrom: "#1E2923",
                  backgroundGradientTo: "#08130D",
                  decimalPlaces: 2, // 精度
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

            {/* 东西多的时候可以滚动看 */}
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 20,
                // 增加顶部空白
              }}
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
    </>
  );
};

export default Stats;

const styles = StyleSheet.create({});
