// /src/utils/dateUtils.ts (Corrected and Finalized)

import {
  format,
  parseISO,
  differenceInMinutes,
  startOfWeek,
  addDays,
  isSameDay,
} from "date-fns";

/**
 * Formats a date object or string into a specified format string.
 * Defaults to a long format like "May 21, 2024".
 * @param date - The date to format (Date object, timestamp, or ISO string).
 * @param formatString - The date-fns format string (e.g., 'MMM d', 'MM/dd/yyyy').
 * @returns {string} The formatted date string.
 */
export const formatDate = (
  date: Date | number | string,
  formatString: string = "MMMM d, yyyy"
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : new Date(date);
  return format(dateObj, formatString);
};

/**
 * Returns the date portion of an ISO string (YYYY-MM-DD) from a Date object.
 * @param {Date} date - The Date object to convert.
 * @returns {string} The date string in "YYYY-MM-DD" format.
 */
export const getISOStringFromDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Parses an ISO 8601 string into a Date object.
 * This is a lightweight wrapper around date-fns's parseISO for consistency.
 * @param {string} isoTimestamp - The ISO string to parse.
 * @returns {Date} The resulting Date object.
 */
export const parseTimestamp = (isoTimestamp: string): Date => {
  return parseISO(isoTimestamp);
};

/**
 * Calculates the difference between two dates in whole minutes.
 * @param {Date | string} dateLeft - The later date.
 * @param {Date | string} dateRight - The earlier date.
 * @returns {number} The difference in minutes.
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
 * Finds the start of the week for a given date.
 * @param {Date} date - The date within the week.
 * @param {0 | 1} [weekStartsOn=1] - The index of the first day of the week (0 for Sunday, 1 for Monday).
 * @returns {Date} The Date object for the start of the week.
 */
export const getStartOfWeek = (date: Date, weekStartsOn: 0 | 1 = 1): Date => {
  return startOfWeek(date, { weekStartsOn });
};

/**
 * Generates an array of all 7 Date objects for a given week.
 * @param {Date} [date=new Date()] - A date within the desired week.
 * @param {0 | 1} [weekStartsOn=1] - The index of the first day of the week.
 * @returns {Date[]} An array of 7 Date objects, from the start to the end of the week.
 */
export const getWeekDates = (
  date: Date = new Date(),
  weekStartsOn: 0 | 1 = 1
): Date[] => {
  const start = getStartOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

/**
 * Checks if two dates are on the same calendar day, independent of time and timezone.
 * This is a more robust implementation than the default date-fns isSameDay
 * which can be tricky with timezones.
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean} True if the dates are the same day.
 */
export const checkIsSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};
