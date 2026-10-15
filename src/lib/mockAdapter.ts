/**
 * Mock Adapter utility for seamless local testing and fallback resilience
 */

export async function withMockFallback<T>(
  apiCall: () => Promise<T>,
  mockFallbackData: T,
  simulatedDelayMs: number = 300
): Promise<T> {
  const isMockMode = !import.meta.env.VITE_API_URL;

  if (isMockMode) {
    if (simulatedDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
    }
    return mockFallbackData;
  }

  try {
    return await apiCall();
  } catch (error) {
    console.warn('[MockAdapter Fallback Triggered]:', error);
    if (simulatedDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, simulatedDelayMs));
    }
    return mockFallbackData;
  }
}
