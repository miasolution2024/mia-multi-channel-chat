/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useCallback } from "react";

// ----------------------------------------------------------------------

export function useTabs(defaultValue: any) {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback((event: any, newValue: any) => {
    setValue(newValue);
  }, []);

  const memoizedValue = useMemo(
    () => ({ value, setValue, onChange }),
    [onChange, value]
  );

  return memoizedValue;
}
