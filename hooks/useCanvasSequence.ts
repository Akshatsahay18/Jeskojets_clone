"use client";

import { RefObject, useEffect } from "react";
import { MotionValue } from "framer-motion";
import { clamp } from "@/lib/clamp";
import { lerp } from "@/lib/lerp";

type UseCanvasSequenceArgs = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  imagesRef: RefObject<Array<HTMLImageElement | null>>;
  progress: MotionValue<number>;
  frameCount: number;
  smoothing?: number;
  dprCap?: number;
};

export function useCanvasSequence({
  canvasRef,
  imagesRef,
  progress,
  frameCount,
  smoothing = 0.1,
  dprCap = 2
}: UseCanvasSequenceArgs) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let rafId = 0;
    let targetFrame = clamp(progress.get(), 0, 1) * (frameCount - 1);
    let currentFrame = targetFrame;
    let lastDrawnFrame = -1;

    const getLoadedFrame = (index: number) => {
      const frames = imagesRef.current ?? [];

      for (let offset = 0; offset < frameCount; offset += 1) {
        const backward = index - offset;
        if (backward >= 0) {
          const frame = frames[backward];
          if (frame?.complete && frame.naturalWidth > 0) {
            return frame;
          }
        }

        const forward = index + offset;
        if (forward < frameCount) {
          const frame = frames[forward];
          if (frame?.complete && frame.naturalWidth > 0) {
            return frame;
          }
        }
      }

      return null;
    };

    const resize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);

      canvas.width = Math.floor(viewportWidth * dpr);
      canvas.height = Math.floor(viewportHeight * dpr);
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Force one redraw on resize to avoid stale pixel density.
      lastDrawnFrame = -1;
    };

    const drawImage = (frameIndex: number) => {
      if (frameIndex === lastDrawnFrame) {
        return;
      }

      const image = getLoadedFrame(frameIndex);
      if (!image) {
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scale = Math.max(
        viewportWidth / image.naturalWidth,
        viewportHeight / image.naturalHeight
      );

      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const offsetX = (viewportWidth - drawWidth) / 2;
      const offsetY = (viewportHeight - drawHeight) / 2;

      context.clearRect(0, 0, viewportWidth, viewportHeight);
      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
      lastDrawnFrame = frameIndex;
    };

    const unsubscribe = progress.on("change", (value) => {
      targetFrame = clamp(value, 0, 1) * (frameCount - 1);
    });

    const tick = () => {
      currentFrame = lerp(currentFrame, targetFrame, smoothing);

      if (Math.abs(targetFrame - currentFrame) < 0.01) {
        currentFrame = targetFrame;
      }

      const frameIndex = clamp(
        Math.floor(currentFrame),
        0,
        frameCount - 1
      );

      drawImage(frameIndex);
      rafId = window.requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener("resize", resize);

    return () => {
      unsubscribe();
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, dprCap, frameCount, imagesRef, progress, smoothing]);
}
