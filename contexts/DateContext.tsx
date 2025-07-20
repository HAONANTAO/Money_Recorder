import React, { createContext, useState, useContext, ReactNode } from "react";
import{ Dispatch, SetStateAction } from "react";

type DateContextType = {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
};

// 创建Context
const DateContext = createContext<DateContextType | undefined>(undefined);

// Provider组件
export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(1); // 确保是月初
    return d;
  });

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};

// 自定义Hook方便使用
export const useDate = (): DateContextType => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};
