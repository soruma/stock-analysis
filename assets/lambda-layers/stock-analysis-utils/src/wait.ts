/**
 * Waits for the specified number of milliseconds.
 * @param ms - The number of milliseconds to wait.
 * @returns A Promise that resolves after the specified time.
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
