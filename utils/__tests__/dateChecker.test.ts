/*
 * @Date: 2025-04-07 12:59:32
 * @LastEditors: 陶浩南 taoaaron5@gmail.com
 * @LastEditTime: 2025-04-07 13:03:01
 * @FilePath: /Money_Recorder/utils/__tests__/dateChecker.test.ts
 */
import DateChecker from "../dateChecker";

describe("DateChecker", () => {
  // 使用固定的测试日期
  const mockDate = new Date("2024-01-15");

  it("should filter records for current month and year", () => {
    const records = [
      {
        $id: "1",
        userId: "user1",
        createAt: "2024-01-01",
        moneyAmount: 100,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
      {
        $id: "2",
        userId: "user1",
        createAt: "2024-02-01",
        moneyAmount: 200,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
      {
        $id: "3",
        userId: "user1",
        createAt: "2023-01-01",
        moneyAmount: 300,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
      {
        $id: "4",
        userId: "user1",
        createAt: "2024-01-31",
        moneyAmount: 400,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
    ];

    const filteredRecords = DateChecker(records as MoneyRecord[], mockDate);

    expect(filteredRecords).toHaveLength(2);
    expect(filteredRecords).toEqual([
      {
        $id: "1",
        userId: "user1",
        createAt: "2024-01-01",
        moneyAmount: 100,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
      {
        $id: "4",
        userId: "user1",
        createAt: "2024-01-31",
        moneyAmount: 400,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
    ]);
  });

  it("should handle invalid dates", () => {
    const records = [
      { createAt: "invalid-date", amount: 100 },
      {
        $id: "6",
        userId: "user1",
        createAt: "2024-01-15",
        moneyAmount: 200,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
      { createAt: null, amount: 300 },
      { createAt: undefined, amount: 400 },
    ];

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation();
    const filteredRecords = DateChecker(records as MoneyRecord[], mockDate);

    expect(filteredRecords).toHaveLength(1);
    expect(filteredRecords).toEqual([
      {
        $id: "6",
        userId: "user1",
        createAt: "2024-01-15",
        moneyAmount: 200,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
    ]);
    expect(consoleSpy).toHaveBeenCalledTimes(3);
    consoleSpy.mockRestore();
  });

  it("should handle empty records array", () => {
    const records: any[] = [];
    const filteredRecords = DateChecker(records, mockDate);

    expect(filteredRecords).toHaveLength(0);
    expect(filteredRecords).toEqual([]);
  });

  it("should handle records from different months", () => {
    const records = [
      {
        $id: "9",
        userId: "user1",
        createAt: "2024-01-15",
        moneyAmount: 100,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
      {
        $id: "10",
        userId: "user1",
        createAt: "2024-02-15",
        moneyAmount: 200,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
      {
        $id: "11",
        userId: "user1",
        createAt: "2024-03-15",
        moneyAmount: 300,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
      {
        $id: "12",
        userId: "user1",
        createAt: "2024-12-15",
        moneyAmount: 400,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
    ];

    const filteredRecords = DateChecker(records as MoneyRecord[], mockDate);

    expect(filteredRecords).toHaveLength(1);
    expect(filteredRecords).toEqual([
      {
        $id: "9",
        userId: "user1",
        createAt: "2024-01-15",
        moneyAmount: 100,
        type: "expense",
        category: "food",
        paymentMethod: "cash",
        recurring: false,
      },
    ]);
  });
});
