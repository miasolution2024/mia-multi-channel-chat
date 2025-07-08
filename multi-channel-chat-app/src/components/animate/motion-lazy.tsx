/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { LazyMotion } from "framer-motion";

// ----------------------------------------------------------------------

const loadFeaturesAsync = async () =>
  import("./features").then((res) => res.default);

export function MotionLazy({ children }: any) {
  return (
    <LazyMotion strict features={loadFeaturesAsync}>
      {children}
    </LazyMotion>
  );
}
