// /src/utils/uuid.ts
export const generateUUID = (): string => {
  // A simple UUID generator that's sufficient for React keys.
  // It combines a timestamp with a random number to ensure a high probability of uniqueness.
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomPart}`;
};
