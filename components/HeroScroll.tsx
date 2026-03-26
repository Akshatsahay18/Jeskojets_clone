"use client";

import { useRef } from "react";
import OverlayText from "@/components/OverlayText";
import { useCanvasSequence } from "@/hooks/useCanvasSequence";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const FRAME_COUNT = 120;

export default function HeroScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useScrollProgress(containerRef);
  const { imagesRef, loadedCount, isReady } = useImagePreloader(
    "/sequence-1",
    FRAME_COUNT,
    {
      prefix: "ezgif-frame-",
      digits: 3,
      startIndex: 1,
      eagerCount: 24
    }
  );

  useCanvasSequence({
    canvasRef,
    imagesRef,
    progress,
    frameCount: FRAME_COUNT,
    smoothing: 0.1
  });

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full will-change-transform"
        />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.18),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0.12)_0%,rgba(5,5,5,0.62)_100%)]" />
          <div className="absolute inset-x-0 top-[39%] z-20 px-6 md:px-12">
            <OverlayText
              progress={progress}
              title="Beyond Velocity"
              subtitle="Engineered for the Unreachable."
              titleClassName="font-display text-5xl tracking-[0.24em] md:text-7xl"
              subtitleClassName="tracking-[0.3em] text-white/70"
              fadeOutStart={0.06}
              fadeOutEnd={0.22}
            />
          </div>

          <div className="absolute inset-x-0 bottom-10 z-20 flex justify-center px-6">
            <div className="flex items-center gap-8 rounded-full border border-white/20 bg-black/35 px-6 py-3 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.34em] text-white/70">
                Cloud Sequence
              </p>
              <p className="text-[10px] uppercase tracking-[0.26em] text-white/60">
                {Math.min(100, Math.round((loadedCount / FRAME_COUNT) * 100))}%
              </p>
            </div>
          </div>

          {!isReady ? (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050505]/75">
              <p className="text-xs uppercase tracking-[0.34em] text-white/80">
                Calibrating Frames
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
