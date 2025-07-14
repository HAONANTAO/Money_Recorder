/*
 * @Date: 2025-03-21 21:26:12
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-29 15:28:23
 * @FilePath: /Money_Recorder/app/(tabs)/home.tsx
 */
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageKeys, StorageService } from "@/utils/storageService";
import { getUserByEmail } from "@/services/userManagement";
import { getRecords } from "@/services/recordService";
import {
  getTotalBudget,
  updateBudget,
  createBudget,
  getMonthlyBudget,
} from "@/services/budgetService";
import RecordShowBox from "@/components/RecordShowbox";
import DateChecker from "@/utils/dateChecker";

import { demoRecords } from "@/constants/demoData";
import BudgetDisplayBar from "@/components/BudgetDisplayBar";
import HomeImageShow from "@/components/HomeImageShow";

// 获取当前日期，只需要月份就可以了
const getCurrentDate = (selectedDate: Date) => {
  const { language } = useLanguage();
  const locale = language === "zh" ? "zh-CN" : "en-US";
  return selectedDate.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });
};

const Home = () => {
  const { theme } = useTheme();
  const { translations } = useLanguage();
  const isDark = theme === "dark";

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(0);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [tempBudget, setTempBudget] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();
    date.setDate(1); // 设置为月初
    return date;
  });

  const handlePreviousMonth = useCallback(() => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      newDate.setDate(1); // 确保是月初
      return newDate;
    });
  }, []);

  const handleNextMonth = useCallback(() => {
    const currentDate = new Date();
    currentDate.setDate(1); // 确保比较的是月初
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(1); // 确保是月初
      if (
        newDate.getMonth() < currentDate.getMonth() ||
        newDate.getFullYear() < currentDate.getFullYear()
      ) {
        newDate.setMonth(newDate.getMonth() + 1);
        return newDate;
      }
      return prev;
    });
  }, []);

  const calculateMonthlyStats = useCallback((records: MoneyRecord[]) => {
    // console.log('计算月度统计，当前选中日期:', selectedDate.toISOString());
    // console.log('收到的记录数量:', records.length);

    const totalIncome = records
      .filter((record: any) => record.type === "income")
      .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

    const totalExpense = records
      .filter((record: any) => record.type === "expense")
      .reduce((sum: number, record: any) => sum + record.moneyAmount, 0);

    // console.log('计算结果 - 收入:', totalIncome, '支出:', totalExpense);
    setMonthlyIncome(totalIncome);
    setMonthlyExpense(totalExpense);
  }, [selectedDate]);

  const getInit = useCallback(async () => {
    try {
      const isGuest = await StorageService.getIsGuest();
      if (isGuest) {
        const recordsData = demoRecords as unknown as MoneyRecord[];
        setRecords(recordsData);
        calculateMonthlyStats(recordsData);
        setLoading(false);
        return;
      }

      const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
      if (!email) return;

      // 检查用户是否已删除账号
      const isDeleted = await StorageService.getIsDeleted();
      if (isDeleted) return;

      // 尝试从缓存获取数据
      const cachedRecords = await StorageService.getCachedRecords();
      if (cachedRecords) {
        const recordsData = cachedRecords as unknown as MoneyRecord[];
        setRecords(recordsData);
        calculateMonthlyStats(recordsData);
      }

      // 无论是否有缓存，都异步获取最新数据
      const userData = await getUserByEmail(email);
      const [records, totalBudget] = await Promise.all([
        getRecords(userData.$id, selectedDate.getFullYear(), selectedDate.getMonth() + 1),
        getTotalBudget(
          userData.$id,
          selectedDate.getFullYear(),
          selectedDate.getMonth() + 1,
        ),
      ]);

      const recordsData = records as unknown as MoneyRecord[];
      setRecords(recordsData);
      await StorageService.cacheRecords(recordsData);
      calculateMonthlyStats(recordsData);
      setMonthlyBudget(totalBudget);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user or records:", error);
      setLoading(false);
    }
  }, [selectedDate, calculateMonthlyStats]);

  // 监听选中日期变化，重新获取数据
  useFocusEffect(
    useCallback(() => {
      getInit();
    }, [getInit])
  );

  const handleBudgetChange = () => {
    setTempBudget(monthlyBudget.toString());
    setShowBudgetModal(true);
  };

  const handleConfirmBudget = async () => {
    const newBudget = parseInt(tempBudget);
    if (!isNaN(newBudget) && newBudget > 0) {
      try {
        const isGuest = await StorageService.getIsGuest();
        if (!isGuest) {
          const email = await AsyncStorage.getItem(StorageKeys.EMAIL);
          if (email) {
            const userData = await getUserByEmail(email);
            const selectedYear = selectedDate.getFullYear();
            const selectedMonth = selectedDate.getMonth() + 1;
            const monthlyBudgets = await getMonthlyBudget(
              userData.$id,
              selectedYear,
              selectedMonth,
            );
            const existingTotalBudget = monthlyBudgets.find(
              (budget) => budget.category === "Total",
            );
            if (existingTotalBudget) {
              await updateBudget(existingTotalBudget.budgetId, {
                amount: newBudget,
              });
            } else {
              try {
                await createBudget({
                  userId: userData.$id,
                  category: "Total",
                  amount: newBudget,
                  year: selectedYear,
                  month: selectedMonth,
                });
              } catch (err: any) {
                if (err.message?.includes("already exists")) {
                  // 如果预算已存在，重新获取并更新
                  const latestBudgets = await getMonthlyBudget(
                    userData.$id,
                    selectedYear,
                    selectedMonth,
                  );
                  const existingBudget = latestBudgets.find(
                    (budget) => budget.category === "Total",
                  );
                  if (existingBudget) {
                    await updateBudget(existingBudget.budgetId, {
                      amount: newBudget,
                    });
                  }
                } else {
                  throw err;
                }
              }
            }
            // 清除月度统计缓存
            await AsyncStorage.removeItem(StorageKeys.MONTHLY_STATS);
            // 重新获取所有数据
            const [newRecords, newTotalBudget] = await Promise.all([
              getRecords(userData.$id, selectedDate.getFullYear(), selectedDate.getMonth() + 1),
              getTotalBudget(
                userData.$id,
                selectedDate.getFullYear(),
                selectedDate.getMonth() + 1,
              ),
            ]);
            const recordsData = newRecords as unknown as MoneyRecord[];
            setRecords(recordsData);
         calculateMonthlyStats(recordsData);
            setMonthlyBudget(newTotalBudget);
          }
        } else {
          setMonthlyBudget(newBudget);
        }
      } catch (err: any) {
        console.error("Error updating budget:", err);
      }
    }
    setShowBudgetModal(false);
  };



  // 下拉刷新
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getInit().then(() => setRefreshing(false));
  }, [selectedDate]);

  // 监听路由参数变化
  const params = useLocalSearchParams();

  // 初始化数据
  useEffect(() => {
    getInit();
  }, [getInit]);

  // 监听路由参数变化，实现自动刷新
  useFocusEffect(
    useCallback(() => {
      getInit();
    }, [getInit])
  );

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View
        className={` flex-1 ${
          isDark ? "bg-gray-900" : "bg-gray-100"
        } pt-10 px-4 `}>
        {/* 今天日期 */}
        <View className="pb-8 mt-8">
          <View className="flex-row justify-center items-center mb-4">
            <TouchableOpacity onPress={handlePreviousMonth} className="mr-4">
              <Text
                className={`text-2xl ${
                  isDark ? "text-white" : "text-gray-800"
                }`}>
                ←
              </Text>
            </TouchableOpacity>
            <Text
              className={`text-2xl font-bold text-center ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
              {getCurrentDate(selectedDate)}
            </Text>
            <TouchableOpacity
              onPress={handleNextMonth}
              className="ml-4"
              disabled={
                selectedDate.getMonth() === new Date().getMonth() &&
                selectedDate.getFullYear() === new Date().getFullYear()
              }>
              <Text
                className={`text-2xl ${
                  isDark
                    ? selectedDate.getMonth() === new Date().getMonth() &&
                      selectedDate.getFullYear() === new Date().getFullYear()
                      ? "text-gray-600"
                      : "text-white"
                    : selectedDate.getMonth() === new Date().getMonth() &&
                      selectedDate.getFullYear() === new Date().getFullYear()
                    ? "text-gray-400"
                    : "text-gray-800"
                }`}>
                →
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex items-center">
            <HomeImageShow />
          </View>
        </View>

        {/* 总金额View - 本月总和和明细 */}

        <View
          className={`mt-6 p-6 rounded-3xl space-y-8 ${
            isDark ? "border border-white" : "bg-gray-800"
          }`}>
          <View className="flex flex-row justify-between items-center">
            <Text
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-200"
              }`}>
              {translations.home.monthlyIncome}
            </Text>
            <Text
              className={`text-4xl font-extrabold ml-2 ${
                monthlyIncome - monthlyExpense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}>
              ${(monthlyIncome - monthlyExpense).toFixed(2)}
            </Text>
          </View>
          {/* 小组件显示支出和收入 */}
          <View className="mt-4 space-y-6">
            {/* Net Worth View */}
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-400">
                {translations.home.monthlyIncome}
              </Text>
              <Text className="text-sm font-bold text-gray-400">
                $ {monthlyIncome.toFixed(2)}
              </Text>
            </View>

            {/* Loss View */}
            <View className="flex flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-400">
                {translations.home.monthlyExpense}
              </Text>
              <Text className="text-sm font-bold text-gray-400">
                $ {monthlyExpense.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* myBudget预算bar显示 */}
        <View className="mt-4">
          <BudgetDisplayBar
            currentBudget={monthlyExpense}
            totalBudget={monthlyBudget}
            onBudgetChange={handleBudgetChange}
          />
        </View>

        {/* details */}
        <View
          className={`p-4 mt-6 rounded-2xl border ${
            isDark ? "border-white" : "border-gray-200"
          }`}>
          <View className="flex flex-row flex-wrap justify-around">
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : records.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Text
                  className={`text-lg font-bold ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}>
                  {translations.record.none}
                </Text>
              </View>
            ) : (
              <View className="flex-1 mt-6">
                {/* 筛选按钮 */}
                <View className="flex-row justify-center space-x-4 mb-4">
                  <TouchableOpacity
                    onPress={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-lg ${filterType === 'all' ? 'bg-blue-500' : (isDark ? 'bg-gray-700' : 'bg-gray-200')}`}>
                    <Text className={`font-medium ${filterType === 'all' ? 'text-white' : (isDark ? 'text-white' : 'text-gray-800')}`}>
                      {translations.stats.total}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFilterType('income')}
                    className={`px-4 py-2 rounded-lg ${filterType === 'income' ? 'bg-green-500' : (isDark ? 'bg-gray-700' : 'bg-gray-200')}`}>
                    <Text className={`font-medium ${filterType === 'income' ? 'text-white' : (isDark ? 'text-white' : 'text-gray-800')}`}>
                      {translations.record.income}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFilterType('expense')}
                    className={`px-4 py-2 rounded-lg ${filterType === 'expense' ? 'bg-red-500' : (isDark ? 'bg-gray-700' : 'bg-gray-200')}`}>
                    <Text className={`font-medium ${filterType === 'expense' ? 'text-white' : (isDark ? 'text-white' : 'text-gray-800')}`}>
                      {translations.record.expense}
                    </Text>
                  </TouchableOpacity>
                </View>
                {Object.entries(
                  records
                    .filter((record) => {
                      const recordDate = new Date(record.$createdAt);
                      const dateMatch = recordDate.getMonth() === selectedDate.getMonth() &&
                        recordDate.getFullYear() === selectedDate.getFullYear();
                      const typeMatch = filterType === 'all' ? true : record.type === filterType;
                      return dateMatch && typeMatch;
                    })
                    .sort(
                      (a, b) =>
                        new Date(b.$createdAt).getTime() -
        new Date(a.$createdAt).getTime(),
                    )
                    .reduce(
                      (groups: { [key: string]: MoneyRecord[] }, record) => {
                        const date = new Date(
                          record.$createdAt,
                        ).toLocaleDateString();
                        if (!groups[date]) {
                          groups[date] = [];
                        }
                        groups[date].push(record);
                        return groups;
                      },
                      {},
                    ),
                ).map(([date, groupRecords]) => (
                  <View key={date} className="mb-6">
                    <Text
                      className={`text-lg font-semibold mb-3 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}>
                      {date}
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                      {groupRecords.map((record) => (
                        <RecordShowBox key={record.$id} record={record} />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Budget Setting Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBudgetModal}
        onRequestClose={() => setShowBudgetModal(false)}>
        <View className="flex-1 justify-center items-center">
          <View
            className={`p-6 rounded-2xl w-4/5 ${
              isDark ? "bg-gray-800/90" : "bg-white/90"
            }`}>
            <Text
              className={`text-lg font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-800"
              }`}>
              {translations.home.enterBudget}
            </Text>
            <TextInput
              className={`border p-2 rounded-lg mb-4 ${
                isDark
                  ? "border-gray-600 text-white"
                  : "border-gray-300 text-gray-800"
              }`}
              keyboardType="numeric"
              value={tempBudget}
              onChangeText={setTempBudget}
              placeholder="enter total budget"
              placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
            />
            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity
                onPress={() => setShowBudgetModal(false)}
                className="px-4 py-2 bg-gray-500 rounded-lg">
                <Text className="font-medium text-white">
                  {translations.common.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmBudget}
                className="px-4 py-2 bg-blue-500 rounded-lg">
                <Text className="font-medium text-white">
                  {translations.common.confirm}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Home;
