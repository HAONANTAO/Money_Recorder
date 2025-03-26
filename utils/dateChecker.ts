const DateChecker = (records: MoneyRecord[]): MoneyRecord[] => {
  // 获取当前的月份和年份
  const currentMonth = new Date().getMonth(); // 当前月份 (0-11)
  const currentYear = new Date().getFullYear(); // 当前年份

  const filteredRecords = records.filter((record: any) => {
    const recordDate = new Date(record.createAt);

    //检查 createdAt 是否为有效日期
    if (isNaN(recordDate.getTime())) {
      console.warn(`Invalid date for record: ${record.createdAt}`);
      return false; // 如果日期无效，排除这个记录
    }

    const recordMonth = recordDate.getMonth(); // 获取记录的月份
    const recordYear = recordDate.getFullYear(); // 获取记录的年份

    // 只选择当前月份和年份的记录
    return recordMonth === currentMonth && recordYear === currentYear;
  });
  return filteredRecords;
};

export default DateChecker;
