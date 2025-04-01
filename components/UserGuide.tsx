import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../contexts/ThemeContext";

import { Ionicons } from "@expo/vector-icons";

interface UserGuideProps {
  onClose?: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
  const [visible, setVisible] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const guideSteps = [
    {
      title: "Record Functions",
      content: `Click the "+" button in the bottom navigation bar to easily record every income and expenditure. It supports multiple types of income and expenditure to help you better manage your finances.`,
      icon: "create-outline",
    },
    {
      title: "Budget Goal",
      content: `Set a monthly budget target on the "Budget" page. The system will intelligently track your spending and help you control your spending reasonably.`,
      icon: "wallet-outline",
    },
    {
      title: "Deposit Function",
      content:
        "Create your savings goal on the Goals page, set the target amount and deadline. The system will track your progress and motivate you to achieve your financial goals.",
      icon: "flag-outline",
    },
    {
      title: "Data Stats",
      content:
        "On the Statistics page, view detailed income and expenditure analysis:\n1. View monthly income and expenditure trends\n2. Understand the proportion of expenditure categories\n3. Compare budget execution\n4. Export data to develop financial plans\n",
      icon: "bar-chart-outline",
    },
  ];

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasShownGuide = await AsyncStorage.getItem("hasShownGuide");
      if (hasShownGuide) {
        setVisible(false);
      }
    } catch (error) {
      console.error("Error checking first time:", error);
    }
  };

  const handleClose = async () => {
    try {
      await AsyncStorage.setItem("hasShownGuide", "true");
      setVisible(false);
      if (onClose) onClose();
    } catch (error) {
      console.error("Error saving guide state:", error);
    }
  };

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View
          className={`m-6 p-6 rounded-2xl shadow-lg w-[85%] ${
            isDark ? "bg-quaternary" : "bg-white"
          }`}
          style={{ maxHeight: Dimensions.get("window").height * 0.7 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="items-center mb-6">
              <Ionicons
                name={guideSteps[currentStep].icon as any}
                size={48}
                color={isDark ? "#60A5FA" : "#4B5563"}
              />
              <Text
                className={`mt-4 text-xl font-bold ${
                  isDark ? "text-white" : "text-secondary"
                }`}>
                {guideSteps[currentStep].title}
              </Text>
            </View>

            <Text
              className={`text-base text-center mb-8 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}>
              {guideSteps[currentStep].content}
            </Text>

            <View className="flex-row justify-between items-center mt-4">
              <TouchableOpacity
                onPress={prevStep}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-xl ${
                  currentStep === 0 ? "opacity-50" : ""
                }`}>
                <Text
                  className={`text-base font-medium ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}>
                  Previous
                </Text>
              </TouchableOpacity>

              <View className="flex-row gap-2">
                {guideSteps.map((_, index) => (
                  <View
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentStep === index
                        ? "bg-primary"
                        : isDark
                        ? "bg-gray-600"
                        : "bg-gray-300"
                    }`}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={nextStep}
                className="px-4 py-2 rounded-xl bg-primary">
                <Text className="text-base font-medium text-white">
                  {currentStep === guideSteps.length - 1
                    ? "Completed"
                    : "Next Step"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default UserGuide;
