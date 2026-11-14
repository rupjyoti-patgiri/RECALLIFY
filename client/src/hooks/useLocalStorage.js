import { useState, useEffect } from 'react';

/**
 * Custom React hook for safely syncing state with localStorage.
 * Handles JSON serialization, window events, and browser storage quota limits.
 * 
 * @template T
 * @param {string} key - localStorage key
 * @param {T} initialValue - Fallback initial value
 * @returns {[T, (value: T | ((val: T) => T)) => void]}
 */
export function useLocalStorage(key, initialValue) {
  // Read value from localStorage or fallback
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn(`[Recallify] Error reading localStorage key "${key}":`, error);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  // Update localStorage when state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`[Recallify] Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
