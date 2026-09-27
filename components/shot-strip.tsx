"use client";

import type { Film } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { ShotFrame } from "./shot-frame";

interface ShotStripProps {
  film: Film;
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function ShotStrip({ film, activeIndex, onSelect }: ShotStripProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Storyboard
        </h3>
        <span className="font-mono text-xs text-muted-foreground">
          {film.shots.length} shots
        </span>
      </div>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {film.shots.map((shot, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "group relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg border-2 text-left transition-all",
              i === activeIndex
                ? "border-accent"
                : "border-transparent opacity-70 hover:opacity-100",
            )}
          >
            <ShotFrame shot={shot} index={i} />
            <span className="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent p-1.5 pt-4 text-[11px] font-medium text-white">
              {shot.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
