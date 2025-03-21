/*
 * @Date: 2025-03-21 20:33:40
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-03-21 20:42:40
 * @FilePath: /Money_Recorder/app/_layout.tsx
 */
import { Stack } from "expo-router";
import "../globals.css";
import BottomBar from "../components/BottomBar";
export default function RootLayout() {
  return (
    <>
      <BottomBar />
    </>
  );
}
