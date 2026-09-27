"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Camera,
  Lightbulb,
  Move,
} from "lucide-react";
import { ASPECT_RATIOS, type AspectKey, type Film } from "@/lib/schema";
import { cn, formatDuration } from "@/lib/utils";
import { ShotFrame } from "./shot-frame";

interface ReelPlayerProps {
  film: Film;
  aspect: AspectKey;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

export function ReelPlayer({
  film,
  aspect,
  activeIndex,
  onActiveIndexChange,
}: ReelPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 within the current shot
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const shot = film.shots[activeIndex];
  const durationMs = shot.duration * 1000;

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(film.shots.length - 1, index));
      onActiveIndexChange(clamped);
      setProgress(0);
      startRef.current = 0;
    },
    [film.shots.length, onActiveIndexChange],
  );

  // Playback loop
  useEffect(() => {
    if (!playing) return;

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now - progress * durationMs;
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / durationMs);
      setProgress(p);

      if (p >= 1) {
        if (activeIndex < film.shots.length - 1) {
          onActiveIndexChange(activeIndex + 1);
          setProgress(0);
          startRef.current = 0;
        } else {
          setPlaying(false);
          setProgress(1);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, activeIndex, durationMs, film.shots.length]);

  // Reset start reference when the active shot changes externally
  useEffect(() => {
    startRef.current = 0;
  }, [activeIndex]);

  const togglePlay = () => {
    if (!playing && activeIndex === film.shots.length - 1 && progress >= 1) {
      goTo(0);
    }
    setPlaying((p) => !p);
  };

  const ratio = ASPECT_RATIOS[aspect].ratio;

  const totalDuration = film.shots.reduce((sum, s) => sum + s.duration, 0);
  const elapsedBefore = film.shots
    .slice(0, activeIndex)
    .reduce((sum, s) => sum + s.duration, 0);
  const globalElapsed = elapsedBefore + shot.duration * progress;

  return (
    <div className="flex flex-col gap-3">
      {/* Frame */}
      <div
        className="relative mx-auto w-full max-w-full overflow-hidden rounded-xl border border-border bg-black shadow-2xl"
        style={{ aspectRatio: String(ratio) }}
      >
        <ShotFrame shot={shot} index={activeIndex} playing={playing} />

        {/* Letterbox cinematic bars for wide ratios */}
        {ratio >= 2 && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[4%] bg-black" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[4%] bg-black" />
          </>
        )}

        {/* Top overlay: shot index + rec */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
          <span className="rounded bg-black/50 px-2 py-1 font-mono text-[11px] tracking-wider text-white/80 backdrop-blur-sm">
            SHOT {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(film.shots.length).padStart(2, "0")}
          </span>
          <span className="flex items-center gap-1.5 rounded bg-black/50 px-2 py-1 font-mono text-[11px] text-white/80 backdrop-blur-sm">
            <span
              className={cn(
                "size-2 rounded-full bg-record",
                playing && "animate-record",
              )}
            />
            REC
          </span>
        </div>

        {/* Bottom overlay: caption + lower-third */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-10 sm:p-5 sm:pt-12">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-accent">
            {shot.shotType} · {shot.title}
          </p>
          <p className="max-w-2xl text-balance text-sm text-white/90 sm:text-base">
            {shot.description}
          </p>
        </div>
      </div>

      {/* Scrub progress bar (segmented per shot) */}
      <div className="flex items-center gap-1.5" aria-hidden>
        {film.shots.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className="group relative h-1.5 flex-1 overflow-hidden rounded-full bg-border"
            style={{ flexGrow: s.duration }}
            aria-label={`Go to shot ${i + 1}`}
          >
            <span
              className="absolute inset-y-0 left-0 bg-accent transition-[width]"
              style={{
                width:
                  i < activeIndex
                    ? "100%"
                    : i === activeIndex
                      ? `${progress * 100}%`
                      : "0%",
              }}
            />
          </button>
        ))}
      </div>

      {/* Transport controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-card-2 hover:text-foreground disabled:opacity-30"
            aria-label="Previous shot"
          >
            <SkipBack className="size-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="grid size-11 place-items-center rounded-full bg-foreground text-background transition-transform hover:scale-105 active:scale-95"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 translate-x-0.5 fill-current" />
            )}
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            disabled={activeIndex === film.shots.length - 1}
            className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-card-2 hover:text-foreground disabled:opacity-30"
            aria-label="Next shot"
          >
            <SkipForward className="size-4" />
          </button>
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            {formatDuration(globalElapsed)} / {formatDuration(totalDuration)}
          </span>
        </div>

        <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
          <span className="flex items-center gap-1.5">
            <Move className="size-3.5 text-accent" />
            {shot.cameraMove}
          </span>
          <span className="flex items-center gap-1.5">
            <Lightbulb className="size-3.5 text-accent" />
            {shot.lighting}
          </span>
          <span className="flex items-center gap-1.5">
            <Camera className="size-3.5 text-accent" />
            {shot.duration}s
          </span>
        </div>
      </div>
    </div>
  );
}
