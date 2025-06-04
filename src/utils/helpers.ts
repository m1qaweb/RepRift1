// /src/utils/helpers.ts - Generic helper functions.

/**
 * Formats a number with commas as thousands separators.
 * @param num The number to format.
 * @returns A string representation of the number with commas.
 */
export const formatNumberWithCommas = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Debounces a function, ensuring it's only called after a certain delay
 * since the last time it was invoked.
 * @param func The function to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Add other helper functions as needed.
