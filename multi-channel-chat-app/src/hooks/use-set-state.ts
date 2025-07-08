/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from "@/utils/helper";
import { useMemo, useState, useCallback } from "react";

// ----------------------------------------------------------------------

export function useSetState<T extends Record<string, any>>(initialState: T) {
  const [state, set] = useState<T>(initialState);

  const canReset = !isEqual(state, initialState);

  const setState = useCallback((updateState: Partial<T>) => {
    set((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const setField = useCallback(
    (name: keyof T, updateValue: T[keyof T]) => {
      setState({
        [name]: updateValue,
      } as Partial<T>);
    },
    [setState]
  );

  const onResetState = useCallback(() => {
    set(initialState);
  }, [initialState]);

  const memoizedValue = useMemo(
    () => ({
      state,
      setState,
      setField,
      onResetState,
      canReset,
    }),
    [canReset, onResetState, setField, setState, state]
  );

  return memoizedValue;
}
