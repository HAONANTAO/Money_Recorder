/*
 * @Date: 2025-03-26 20:37:32
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-06-30 21:07:04
 * @FilePath: /Money_Recorder/utils/dateChecker.ts
 */
// MoneyRecord接口通过全局声明文件interfaces.d.ts自动导入
export const DateChecker = (
  records: MoneyRecord[],
  testDate?: Date,
): MoneyRecord[] => {
  if (!Array.isArray(records)) {
    return [];
  }

  // 获取目标月份和年份
  const targetDate = testDate || new Date();
  const targetMonth = targetDate.getMonth(); // 目标月份 (0-11)
  const targetYear = targetDate.getFullYear(); // 目标年份

  const filteredRecords = records.filter((record: MoneyRecord) => {
    // 检查record是否为有效对象
    if (!record || typeof record !== "object") {
      console.warn("Invalid record object:", record);
      return false;
    }

    // 检查$createdAt是否存在且为有效字符串
    if (!record.$createdAt || typeof record.$createdAt !== "string") {
      console.warn(
        `Missing or invalid date for record: ${JSON.stringify(record)}`,
      );
      return false;
    }

    try {
      // 将日期字符串转换为Date对象
      const recordDate = new Date(record.$createdAt);
      const recordTime = recordDate.getTime();

      // 检查日期是否有效
      if (isNaN(recordTime)) {
        console.warn(`Invalid date format for record: ${record.$createdAt}`);
        return false;
      }

      // 获取记录的年月
      const recordMonth = recordDate.getMonth();
      const recordYear = recordDate.getFullYear();

      // 只选择目标月份和年份的记录
      return recordMonth === targetMonth && recordYear === targetYear;
    } catch (error) {
      console.warn(`Error processing date for record: ${record.$createdAt}`);
      return false;
    }
  });

  return filteredRecords;
};

export default DateChecker;
