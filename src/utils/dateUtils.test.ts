// /src/utils/dateUtils.test.ts

import {
  formatDate,
  getISOStringFromDate,
  parseTimestamp,
  getDurationInMinutes,
  getStartOfWeek,
  getWeekDates,
  checkIsSameDay,
} from "./dateUtils";

describe("dateUtils", () => {
  describe("formatDate", () => {
    it("should format a Date object into the default format", () => {
      const date = new Date("2024-05-21T12:00:00.000Z");
      expect(formatDate(date)).toBe("May 21, 2024");
    });

    it("should format a date from an ISO string with a custom format", () => {
      const isoString = "2024-03-15T08:30:00.000Z";
      expect(formatDate(isoString, "MM/dd/yy")).toBe("03/15/24");
    });

    it("should format a date from a timestamp", () => {
      const timestamp = new Date("2023-01-01T00:00:00.000Z").getTime();
      expect(formatDate(timestamp, "yyyy-MM-dd")).toBe("2023-01-01");
    });
  });

  describe("getISOStringFromDate", () => {
    it("should return the date part of a Date object's ISO string", () => {
      const date = new Date("2024-07-04T18:05:00.000Z");
      expect(getISOStringFromDate(date)).toBe("2024-07-04");
    });
  });

  describe("parseTimestamp", () => {
    it("should parse an ISO timestamp string into a Date object", () => {
      const isoString = "2024-09-10T13:00:00.000Z";
      const expectedDate = new Date(isoString);
      expect(parseTimestamp(isoString)).toEqual(expectedDate);
    });
  });

  describe("getDurationInMinutes", () => {
    it("should calculate the difference between two Date objects in minutes", () => {
      const dateLeft = new Date("2024-01-01T13:00:00.000Z");
      const dateRight = new Date("2024-01-01T12:00:00.000Z");
      expect(getDurationInMinutes(dateLeft, dateRight)).toBe(60);
    });

    it("should handle ISO string inputs", () => {
      const isoLeft = "2024-01-01T10:30:00.000Z";
      const isoRight = "2024-01-01T10:00:00.000Z";
      expect(getDurationInMinutes(isoLeft, isoRight)).toBe(30);
    });
  });

  describe("getStartOfWeek", () => {
    it("should find the start of the week (Monday) for a given date", () => {
      const date = new Date("2024-05-23T10:00:00.000Z"); // A Thursday
      const startOfWeek = getStartOfWeek(date, 1);
      expect(startOfWeek.getDate()).toBe(20); // The previous Monday
    });

    it("should find the start of the week (Sunday) when specified", () => {
      const date = new Date("2024-05-23T10:00:00.000Z"); // A Thursday
      const startOfWeek = getStartOfWeek(date, 0);
      expect(startOfWeek.getDate()).toBe(19); // The previous Sunday
    });
  });

  describe("getWeekDates", () => {
    it("should generate an array of 7 days for the week, starting on Monday", () => {
      const date = new Date("2024-05-23T10:00:00.000Z"); // A Thursday
      const weekDates = getWeekDates(date, 1);
      expect(weekDates.length).toBe(7);
      expect(weekDates[0].getDate()).toBe(20); // Starts on Monday 20th
      expect(weekDates[6].getDate()).toBe(26); // Ends on Sunday 26th
    });

    it("should generate an array of 7 days for the week, starting on Sunday", () => {
      const date = new Date("2024-05-23T10:00:00.000Z"); // A Thursday
      const weekDates = getWeekDates(date, 0);
      expect(weekDates.length).toBe(7);
      expect(weekDates[0].getDate()).toBe(19); // Starts on Sunday 19th
      expect(weekDates[6].getDate()).toBe(25); // Ends on Saturday 25th
    });
  });

  describe("checkIsSameDay", () => {
    it("should return true for two Date objects on the same day", () => {
      // Manually construct dates in the local timezone to avoid UTC parsing issues.
      const date1 = new Date(2024, 1, 29, 8, 0, 0); // Feb 29th, 8:00 AM
      const date2 = new Date(2024, 1, 29, 23, 0, 0); // Feb 29th, 11:00 PM
      expect(checkIsSameDay(date1, date2)).toBe(true);
    });

    it("should return false for two Date objects on different days", () => {
      const date1 = new Date(2024, 2, 1, 23, 59, 59); // March 1st
      const date2 = new Date(2024, 2, 2, 0, 0, 0); // March 2nd
      expect(checkIsSameDay(date1, date2)).toBe(false);
    });
  });
});
