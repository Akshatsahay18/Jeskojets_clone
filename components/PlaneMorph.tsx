"use client";

import { motion, useTransform } from "framer-motion";
import { useRef } from "react";
import OverlayText from "@/components/OverlayText";
import { useCanvasSequence } from "@/hooks/useCanvasSequence";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const FRAME_COUNT = 120;

export default function PlaneMorph() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useScrollProgress(containerRef);
  const { imagesRef } = useImagePreloader("/sequence-2", FRAME_COUNT, {
    prefix: "ezgif-frame-",
    digits: 3,
    startIndex: 1,
    eagerCount: 18
  });
  const specsOpacity = useTransform(progress, [0.48, 0.7], [0, 1]);
  const specsY = useTransform(progress, [0.48, 0.7], [28, 0]);

  useCanvasSequence({
    canvasRef,
    imagesRef,
    progress,
    frameCount: FRAME_COUNT,
    smoothing: 0.12
  });

  return (
    <section ref={containerRef} className="relative h-[340vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full will-change-transform"
        />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.12),transparent_32%),linear-gradient(180deg,rgba(5,5,5,0.18)_0%,rgba(5,5,5,0.72)_100%)]" />

          <div className="absolute inset-x-0 top-24 z-20 px-6 md:px-12 lg:px-16">
            <OverlayText
              progress={progress}
              title="Form evolves."
              subtitle="Precision remains."
              className="text-left"
              titleClassName="font-display text-4xl tracking-[0.22em] md:text-6xl"
              subtitleClassName="tracking-[0.28em] text-white/72"
              fadeOutStart={0.2}
              fadeOutEnd={0.46}
              yOffset={-22}
            />
          </div>

          <motion.div
            style={{ opacity: specsOpacity, y: specsY }}
            className="absolute inset-x-0 bottom-16 z-20 px-6 md:px-12 lg:px-16"
          >
            <div className="ml-auto grid max-w-3xl gap-6 rounded-2xl border border-white/15 bg-black/45 p-6 backdrop-blur-md md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.34em] text-white/55">
                  Cruise Range
                </p>
                <p className="font-display text-3xl tracking-[0.12em] text-white">
                  7,500nm
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.34em] text-white/55">
                  Max Cruise
                </p>
                <p className="font-display text-3xl tracking-[0.12em] text-white">
                  Mach 0.925
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
