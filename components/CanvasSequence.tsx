"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";

type CanvasSequenceProps = {
  path: string;
  frameCount: number;
  eyebrow: string;
  title: string;
  description: string;
  caption?: string;
  align?: "left" | "center" | "right";
  heightClassName?: string;
};

export default function CanvasSequence({
  path,
  frameCount,
  eyebrow,
  title,
  description,
  caption,
  align = "left",
  heightClassName = "h-[360vh]"
}: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFrameRef = useRef(0);
  const progress = useScrollProgress(containerRef);
  const { images, isInitialReady } = useImagePreloader(path, frameCount, {
    prefix: "ezgif-frame-",
    digits: 3,
    startIndex: 1,
    eagerCount: 20
  });

  useEffect(() => {
    if (!isInitialReady) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const resolveFrame = (index: number) => {
      for (let offset = 0; offset < frameCount; offset += 1) {
        const backward = index - offset;
        if (backward >= 0) {
          const frame = images.current[backward];
          if (frame?.complete && frame.naturalWidth > 0) {
            return frame;
          }
        }

        const forward = index + offset;
        if (forward < frameCount) {
          const frame = images.current[forward];
          if (frame?.complete && frame.naturalWidth > 0) {
            return frame;
          }
        }
      }

      return null;
    };

    const render = (index: number) => {
      lastFrameRef.current = index;
      const frame = resolveFrame(index);
      if (!frame) {
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scale = Math.max(
        viewportWidth / frame.naturalWidth,
        viewportHeight / frame.naturalHeight
      );
      const width = frame.naturalWidth * scale;
      const height = frame.naturalHeight * scale;
      const x = (viewportWidth - width) / 2;
      const y = (viewportHeight - height) / 2;

      context.clearRect(0, 0, viewportWidth, viewportHeight);
      context.drawImage(frame, x, y, width, height);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      canvas.width = Math.floor(viewportWidth * dpr);
      canvas.height = Math.floor(viewportHeight * dpr);
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      render(lastFrameRef.current);
    };

    resize();

    const unsubscribe = progress.on("change", (value) => {
      const nextFrame = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(value * (frameCount - 1)))
      );

      if (nextFrame !== lastFrameRef.current) {
        render(nextFrame);
      }
    });

    window.addEventListener("resize", resize);

    return () => {
      unsubscribe();
      window.removeEventListener("resize", resize);
    };
  }, [frameCount, images, isInitialReady, progress]);

  return (
    <section ref={containerRef} className={cn("relative", heightClassName)}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="h-screen w-full will-change-transform"
          aria-hidden="true"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_36%),linear-gradient(180deg,rgba(5,5,5,0.08),rgba(5,5,5,0.6))]" />
        <div className="absolute inset-0 bg-luxury-grid bg-[size:72px_72px] opacity-[0.04]" />

        <div
          className={cn(
            "absolute inset-0 flex px-6 pb-12 pt-28 md:px-12 md:pb-16 lg:px-20 lg:pt-32",
            align === "center" && "items-end justify-center text-center",
            align === "left" && "items-end justify-start text-left",
            align === "right" && "items-end justify-end text-right"
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl space-y-5"
          >
            <p className="text-[11px] uppercase tracking-wideLuxury text-white/65">
              {eyebrow}
            </p>
            <h1 className="font-display text-5xl uppercase leading-none tracking-[0.12em] text-white md:text-7xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-white/72 md:text-base">
              {description}
            </p>
            {caption ? (
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">
                {caption}
              </p>
            ) : null}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

