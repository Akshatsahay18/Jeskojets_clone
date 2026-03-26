"use client";

import { RefObject } from "react";
import { useScroll } from "framer-motion";

export function useScrollProgress<T extends HTMLElement>(
  ref: RefObject<T | null>
) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"]
  });

  return scrollYProgress;
}

