"use client";

import { useEffect, useRef, useState } from "react";

type UseImagePreloaderOptions = {
  prefix?: string;
  extension?: string;
  startIndex?: number;
  digits?: number;
  eagerCount?: number;
};

export function useImagePreloader(
  path: string,
  frameCount: number,
  {
    prefix = "",
    extension = "jpg",
    startIndex = 0,
    digits = 4,
    eagerCount = 20
  }: UseImagePreloaderOptions = {}
) {
  const imagesRef = useRef<Array<HTMLImageElement | null>>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isInitialReady, setIsInitialReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;
    let loadedFrames = 0;
    const readyThreshold = Math.min(eagerCount, frameCount);
    const hasIdleCallback =
      typeof window.requestIdleCallback === "function" &&
      typeof window.cancelIdleCallback === "function";

    imagesRef.current = Array.from({ length: frameCount }, () => null);
    setLoadedCount(0);
    setIsReady(false);
    setIsInitialReady(false);

    const loadFrame = (index: number) => {
      if (cancelled || imagesRef.current[index]) {
        return;
      }

      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) {
          return;
        }

        loadedFrames += 1;
        setLoadedCount(loadedFrames);

        if (index === 0) {
          setIsInitialReady(true);
        }

        if (loadedFrames >= readyThreshold) {
          setIsReady(true);
        }
      };
      img.src = `${path}/${prefix}${String(index + startIndex).padStart(
        digits,
        "0"
      )}.${extension}`;
      imagesRef.current[index] = img;
    };

    for (let index = 0; index < Math.min(eagerCount, frameCount); index += 1) {
      loadFrame(index);
    }

    let cursor = eagerCount;

    const queueRemaining = () => {
      if (cancelled || cursor >= frameCount) {
        return;
      }

      const batchEnd = Math.min(cursor + 12, frameCount);
      for (; cursor < batchEnd; cursor += 1) {
        loadFrame(cursor);
      }

      if (cursor < frameCount) {
        if (hasIdleCallback) {
          idleHandle = window.requestIdleCallback(queueRemaining);
        } else {
          timeoutHandle = window.setTimeout(queueRemaining, 32);
        }
      }
    };

    queueRemaining();

    return () => {
      cancelled = true;

      if (idleHandle !== null && hasIdleCallback) {
        window.cancelIdleCallback(idleHandle);
      }

      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, [digits, eagerCount, extension, frameCount, path, prefix, startIndex]);

  return {
    imagesRef,
    images: imagesRef,
    loadedCount,
    isReady,
    isInitialReady
  };
}
