import { Clapperboard } from "lucide-react";
import { ASPECT_RATIOS, type AspectKey } from "@/lib/schema";

export function EmptyStage() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="relative mb-6">
        <div className="grid size-20 place-items-center rounded-2xl border border-border bg-card-2">
          <Clapperboard className="size-9 text-accent" />
        </div>
        <span className="absolute -right-1 -top-1 size-3 animate-record rounded-full bg-record" />
      </div>
      <h2 className="font-display text-3xl italic text-foreground">
        Your reel starts with a sentence
      </h2>
      <p className="mt-3 max-w-md text-pretty text-sm text-muted-foreground">
        Describe a concept, pick a look, and PromptReel will direct it into a
        shot-by-shot storyboard you can play back like a film.
      </p>
    </div>
  );
}

export function GeneratingStage({
  aspect,
  shots,
}: {
  aspect: AspectKey;
  shots: number;
}) {
  const ratio = ASPECT_RATIOS[aspect].ratio;
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="space-y-3">
        <div className="h-3 w-32 rounded bg-card-2" />
        <div className="animate-shimmer relative h-10 w-2/3 overflow-hidden rounded bg-card-2" />
        <div className="h-3 w-1/2 rounded bg-card-2" />
      </div>
      <div
        className="animate-shimmer relative w-full overflow-hidden rounded-xl border border-border bg-card-2"
        style={{ aspectRatio: String(ratio) }}
      >
        <div className="absolute inset-0 grid place-items-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Rendering frames…
          </p>
        </div>
      </div>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: Math.min(6, shots) }).map((_, i) => (
          <div
            key={i}
            className="animate-shimmer relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg bg-card-2"
          />
        ))}
      </div>
    </div>
  );
}
