import { Film } from "lucide-react";
import { Studio } from "@/components/studio";

export default function Page() {
  return (
    <div className="flex h-dvh flex-col">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="grid size-8 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Film className="size-4.5" />
          </div>
          <div className="leading-none">
            <span className="font-display text-lg italic tracking-tight">
              PromptReel
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            AI film studio
          </span>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-border bg-card-2 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Deploy
          </a>
        </div>
      </header>
      <Studio />
    </div>
  );
}
