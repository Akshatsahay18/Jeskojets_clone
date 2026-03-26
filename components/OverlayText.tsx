"use client";

import { MotionValue, motion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type OverlayTextProps = {
  progress?: MotionValue<number>;
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  fadeOutStart?: number;
  fadeOutEnd?: number;
  yOffset?: number;
};

export default function OverlayText({
  progress,
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  fadeOutStart = 0.05,
  fadeOutEnd = 0.2,
  yOffset = -32
}: OverlayTextProps) {
  const opacity = progress
    ? useTransform(progress, [0, fadeOutStart, fadeOutEnd], [1, 1, 0])
    : 1;
  const y = progress
    ? useTransform(progress, [0, fadeOutEnd], [0, yOffset])
    : 0;

  return (
    <motion.div
      className={cn("text-center", className)}
      style={{ opacity, y }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <h1
        className={cn(
          "text-4xl uppercase tracking-[0.2em] text-white md:text-6xl",
          titleClassName
        )}
      >
        {title}
      </h1>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 text-xs uppercase tracking-[0.28em] text-white/80 md:text-sm",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </motion.div>
  );
}

