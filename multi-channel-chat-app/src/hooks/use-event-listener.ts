/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useLayoutEffect } from "react";

// ----------------------------------------------------------------------

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ----------------------------------------------------------------------

export function useEventListener(
  eventName: any,
  handler: any,
  element?: any,
  options?: any
) {
  // Create a ref that stores handler
  const savedHandler = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Define the listening target
    const targetElement = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener = (event: any) => savedHandler.current(event);

    targetElement.addEventListener(eventName, eventListener, options);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, options]);
}
