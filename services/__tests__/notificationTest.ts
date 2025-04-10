import * as Notifications from "expo-notifications";
import {
  scheduleDailyReminder,
  requestNotificationPermissions,
  checkNotificationStatus,
  cancelAllNotifications,
} from "../notificationService";

jest.mock("expo-notifications");

describe("Notification Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkNotificationStatus", () => {
    it("should return true when notifications are granted", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: "granted",
      });

      const result = await checkNotificationStatus();
      expect(result).toBe(true);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
    });

    it("should return false when notifications are not granted", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: "denied",
      });

      const result = await checkNotificationStatus();
      expect(result).toBe(false);
      expect(Notifications.getPermissionsAsync).toHaveBeenCalled();
    });
  });

  describe("requestNotificationPermissions", () => {
    it("should request permissions when not already granted", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: false,
        status: "denied",
      });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: "granted",
      });

      const result = await requestNotificationPermissions();
      expect(result).toBe(true);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it("should not request permissions when already granted", async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValue({
        granted: true,
        status: "granted",
      });

      const result = await requestNotificationPermissions();
      expect(result).toBe(true);
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });
  });

  describe("scheduleDailyReminder", () => {
    it("should schedule a daily reminder successfully", async () => {
      (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue(
        "notification-id",
      );

      const translations = {
        notifications: {
          title: "每日提醒",
          body: "记得记录今天的支出哦",
        },
      };

      const result = await scheduleDailyReminder(20, 0, translations);
      expect(result).toBe(true);
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: translations.notifications.title,
          body: translations.notifications.body,
          sound: true,
        },
        trigger: expect.objectContaining({
          type: "calendar",
          hour: 20,
          minute: 0,
          repeats: true,
        }),
      });
    });

    it("should handle scheduling errors gracefully", async () => {
      (Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValue(
        new Error("Scheduling failed"),
      );

      const translations = {
        notifications: {
          title: "每日提醒",
          body: "记得记录今天的支出哦",
        },
      };

      const result = await scheduleDailyReminder(20, 0, translations);
      expect(result).toBe(false);
    });
  });

  describe("cancelAllNotifications", () => {
    it("should cancel all scheduled notifications", async () => {
      await cancelAllNotifications();
      expect(
        Notifications.cancelAllScheduledNotificationsAsync,
      ).toHaveBeenCalled();
    });
  });
});
