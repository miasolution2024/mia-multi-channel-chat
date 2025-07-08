/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";

// ----------------------------------------------------------------------

export function useDebounce(value: any, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
