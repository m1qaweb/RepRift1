// /src/utils/dateUtils.ts - Functions for date and time manipulation.
import {
  format,
  parseISO,
  differenceInMinutes,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";

/**
 * Formats a date object or ISO string into a readable string.
 * Example: "MMMM d, yyyy" -> "January 1, 2023"
 * @param date The date to format (Date object, timestamp number, or ISO string).
 * @param formatString The date-fns format string.
 * @returns The formatted date string.
 */
export const formatDate = (
  date: Date | number | string,
  formatString: string = "MMMM d, yyyy"
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  return format(dateObj, formatString);
};

/**
 * Parses an ISO timestamp string into a Date object.
 * @param isoTimestamp The ISO timestamp string.
 * @returns A Date object.
 */
export const parseTimestamp = (isoTimestamp: string): Date => {
  return parseISO(isoTimestamp);
};

/**
 * Calculates the difference in minutes between two dates.
 * @param dateLeft The first date.
 * @param dateRight The second date.
 * @returns The difference in minutes.
 */
export const getDurationInMinutes = (
  dateLeft: Date | string,
  dateRight: Date | string
): number => {
  const d1 = typeof dateLeft === "string" ? parseISO(dateLeft) : dateLeft;
  const d2 = typeof dateRight === "string" ? parseISO(dateRight) : dateRight;
  return differenceInMinutes(d1, d2);
};

/**
 * Gets the start of the week for a given date.
 * @param date The date.
 * @param weekStartsOn 0 for Sunday, 1 for Monday, etc.
 * @returns The Date object representing the start of the week.
 */
export const getStartOfWeek = (date: Date, weekStartsOn: 0 | 1 = 1): Date => {
  return startOfWeek(date, { weekStartsOn });
};

/**
 * Gets an array of dates for the current week.
 * @param date Date within the target week
 * @param weekStartsOn
 * @returns Array of Date objects
 */
export const getWeekDates = (
  date: Date = new Date(),
  weekStartsOn: 0 | 1 = 1
): Date[] => {
  const start = getStartOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

/**
 * Checks if two dates are on the same day.
 * @param date1 First date.
 * @param date2 Second date.
 * @returns True if same day, false otherwise.
 */
export const checkIsSameDay = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

// Add other date utility functions as needed.
