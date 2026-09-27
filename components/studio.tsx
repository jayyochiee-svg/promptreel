"use client";

import { useState } from "react";
import { Film as FilmIcon, AlertCircle } from "lucide-react";
import type {
  AspectKey,
  Film,
  GenerateResponse,
} from "@/lib/schema";
import { PromptComposer } from "./prompt-composer";
import { ReelPlayer } from "./reel-player";
import { ShotStrip } from "./shot-strip";
import { EmptyStage, GeneratingStage } from "./stages";

interface ComposerState {
  concept: string;
  style: string;
  tone: string;
  aspect: AspectKey;
  shotCount: number;
}

const INITIAL: ComposerState = {
  concept: "",
  style: "Cinematic",
  tone: "Epic",
  aspect: "16:9",
  shotCount: 5,
};

export function Studio() {
  const [composer, setComposer] = useState<ComposerState>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [film, setFilm] = useState<Film | null>(null);
  const [aspect, setAspect] = useState<AspectKey>("16:9");
  const [isDemo, setIsDemo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const generate = async () => {
    if (!composer.concept.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composer),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      const data = (await res.json()) as GenerateResponse;
      setFilm(data.film);
      setAspect(data.aspect);
      setIsDemo(data.demo);
      setActiveIndex(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid flex-1 grid-cols-1 gap-px overflow-hidden bg-border lg:grid-cols-[minmax(340px,380px)_1fr]">
      {/* Composer panel */}
      <aside className="overflow-y-auto bg-background p-5 sm:p-6">
        <PromptComposer
          value={composer}
          onChange={setComposer}
          onGenerate={generate}
          loading={loading}
        />
      </aside>

      {/* Stage panel */}
      <main className="overflow-y-auto bg-background p-5 sm:p-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-record/40 bg-record/10 p-4 text-sm text-foreground">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-record" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <GeneratingStage aspect={composer.aspect} shots={composer.shotCount} />
        ) : film ? (
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent">
                  <FilmIcon className="size-3.5" />
                  {film.genre}
                </div>
                <h2 className="font-display text-4xl italic leading-none text-foreground sm:text-5xl">
                  {film.title}
                </h2>
                <p className="max-w-xl text-pretty text-sm text-muted-foreground">
                  {film.logline}
                </p>
              </div>
              {isDemo && (
                <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  Demo reel
                </span>
              )}
            </header>

            <ReelPlayer
              film={film}
              aspect={aspect}
              activeIndex={activeIndex}
              onActiveIndexChange={setActiveIndex}
            />

            <ShotStrip
              film={film}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />
          </div>
        ) : (
          <EmptyStage />
        )}
      </main>
    </div>
  );
}
