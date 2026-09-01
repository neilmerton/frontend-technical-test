import { useEffect, useState } from 'react';

/**
 * Returns a copy of `value` that only updates once `delayMs` has passed
 * without `value` changing again, so callers can react to typing without
 * re-filtering on every keystroke.
 *
 * @param {*} value
 * @param {number} delayMs
 * @return {*}
 */
export default function useDebouncedValue(value, delayMs) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);

    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
