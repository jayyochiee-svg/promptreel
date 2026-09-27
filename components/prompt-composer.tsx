"use client";

import { Clapperboard, Sparkles, Loader2, Shuffle } from "lucide-react";
import {
  ASPECT_RATIOS,
  STYLE_PRESETS,
  TONE_PRESETS,
  type AspectKey,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

const IDEAS = [
  "A lighthouse keeper who collects lost radio signals from the sea",
  "The last garden growing inside an abandoned space station",
  "A detective in a city where it never stops raining neon",
  "Two rival street cartographers mapping a shape-shifting city",
  "A child who can pause time but only for thirty seconds",
  "A traveling cinema that appears in towns the night before they vanish",
];

interface ComposerState {
  concept: string;
  style: string;
  tone: string;
  aspect: AspectKey;
  shotCount: number;
}

interface PromptComposerProps {
  value: ComposerState;
  onChange: (next: ComposerState) => void;
  onGenerate: () => void;
  loading: boolean;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card-2 text-muted-foreground hover:border-accent/50 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function PromptComposer({
  value,
  onChange,
  onGenerate,
  loading,
}: PromptComposerProps) {
  const set = <K extends keyof ComposerState>(
    key: K,
    v: ComposerState[K],
  ) => onChange({ ...value, [key]: v });

  const surprise = () => {
    const idea = IDEAS[Math.floor(Math.random() * IDEAS.length)];
    set("concept", idea);
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="concept"
            className="flex items-center gap-2 text-sm font-medium"
          >
            <Clapperboard className="size-4 text-accent" />
            Film concept
          </label>
          <button
            type="button"
            onClick={surprise}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-accent"
          >
            <Shuffle className="size-3.5" />
            Surprise me
          </button>
        </div>
        <textarea
          id="concept"
          value={value.concept}
          onChange={(e) => set("concept", e.target.value)}
          onKeyDown={(e) => {
            if (
              (e.metaKey || e.ctrlKey) &&
              e.key === "Enter" &&
              !e.nativeEvent.isComposing &&
              e.keyCode !== 229
            ) {
              e.preventDefault();
              onGenerate();
            }
          }}
          placeholder="Describe the story, mood, or single image you want to see come alive…"
          rows={5}
          maxLength={600}
          className="w-full resize-none rounded-lg border border-input bg-card-2 p-3 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-accent focus:ring-1 focus:ring-ring"
        />
        <p className="text-right text-xs text-muted-foreground/60">
          {value.concept.length}/600 · ⌘↵ to generate
        </p>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Visual style
        </p>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((s) => (
            <Chip
              key={s}
              active={value.style === s}
              onClick={() => set("style", s)}
            >
              {s}
            </Chip>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tone
        </p>
        <div className="flex flex-wrap gap-2">
          {TONE_PRESETS.map((t) => (
            <Chip
              key={t}
              active={value.tone === t}
              onClick={() => set("tone", t)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Aspect ratio
          </p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(ASPECT_RATIOS) as AspectKey[]).map((a) => (
              <Chip
                key={a}
                active={value.aspect === a}
                onClick={() => set("aspect", a)}
              >
                {a}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Shots
          </p>
          <span className="font-mono text-sm text-accent">
            {value.shotCount}
          </span>
        </div>
        <input
          type="range"
          min={3}
          max={10}
          step={1}
          value={value.shotCount}
          onChange={(e) => set("shotCount", Number(e.target.value))}
          aria-label="Number of shots"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
        />
      </div>

      <div className="mt-auto">
        <button
          type="button"
          onClick={onGenerate}
          disabled={loading || !value.concept.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Directing your reel…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Generate reel
            </>
          )}
        </button>
      </div>
    </div>
  );
}
