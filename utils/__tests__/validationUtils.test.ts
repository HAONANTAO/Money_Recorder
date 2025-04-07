import {
  ValidationError,
  DatabaseError,
  validateRecord,
  validateDatabaseConfig,
  handleDatabaseError,
  validateSearchParams,
} from "../validationUtils";

describe("validationUtils", () => {
  describe("validateRecord", () => {
    const validRecord = {
      userId: "user123",
      type: "expense",
      moneyAmount: 100,
      category: "food",
    };

    it("should not throw error for valid record", () => {
      expect(() => validateRecord(validRecord)).not.toThrow();
    });

    it("should throw error for null record", () => {
      expect(() => validateRecord(null)).toThrow(ValidationError);
      expect(() => validateRecord(null)).toThrow("Record data is required");
    });

    it("should throw error for missing userId", () => {
      const invalidRecord = { ...validRecord, userId: undefined };
      expect(() => validateRecord(invalidRecord)).toThrow(
        "User ID is required",
      );
    });

    it("should throw error for missing type", () => {
      const invalidRecord = { ...validRecord, type: undefined };
      expect(() => validateRecord(invalidRecord)).toThrow(
        "Record type is required",
      );
    });

    it("should throw error for invalid money amount", () => {
      const invalidRecord = { ...validRecord, moneyAmount: -100 };
      expect(() => validateRecord(invalidRecord)).toThrow(
        "Invalid money amount",
      );
    });

    it("should throw error for missing category", () => {
      const invalidRecord = { ...validRecord, category: undefined };
      expect(() => validateRecord(invalidRecord)).toThrow(
        "Category is required",
      );
    });
  });

  describe("validateDatabaseConfig", () => {
    it("should not throw error for valid config", () => {
      expect(() => validateDatabaseConfig("db123", "col123")).not.toThrow();
    });

    it("should throw error for missing databaseId", () => {
      expect(() => validateDatabaseConfig(undefined, "col123")).toThrow(
        "Database configuration is missing",
      );
    });

    it("should throw error for missing collectionId", () => {
      expect(() => validateDatabaseConfig("db123", undefined)).toThrow(
        "Database configuration is missing",
      );
    });
  });

  describe("handleDatabaseError", () => {
    it("should throw DatabaseError with formatted message", () => {
      const originalError = new Error("Connection failed");
      expect(() => handleDatabaseError(originalError, "connect")).toThrow(
        DatabaseError,
      );
      expect(() => handleDatabaseError(originalError, "connect")).toThrow(
        "Failed to connect: Connection failed",
      );
    });
  });

  describe("validateSearchParams", () => {
    it("should not throw error for valid params", () => {
      expect(() =>
        validateSearchParams("user123", "search text"),
      ).not.toThrow();
    });

    it("should throw error for missing userId", () => {
      expect(() => validateSearchParams("", "search text")).toThrow(
        "User ID is required for search",
      );
    });

    it("should throw error for invalid search text", () => {
      expect(() => validateSearchParams("user123", "")).toThrow(
        "Valid search text is required",
      );
      // @ts-ignore
      expect(() => validateSearchParams("user123", null)).toThrow(
        "Valid search text is required",
      );
    });
  });
});
