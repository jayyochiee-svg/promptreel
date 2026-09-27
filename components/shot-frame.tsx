import type { Shot } from "@/lib/schema";
import { cn } from "@/lib/utils";

interface ShotFrameProps {
  shot: Shot;
  index: number;
  playing?: boolean;
  className?: string;
}

function safeColor(c: string, fallback: string): string {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c) ? c : fallback;
}

/**
 * Renders a cinematic "frame" for a shot using its color palette.
 * No external image assets — the look is composed from layered gradients,
 * a subtle Ken Burns motion while playing, and a film-grain overlay.
 */
export function ShotFrame({
  shot,
  index,
  playing = false,
  className,
}: ShotFrameProps) {
  const [c0, c1, c2] = [
    safeColor(shot.palette[0], "#0b1e3f"),
    safeColor(shot.palette[1], "#2b5f9e"),
    safeColor(shot.palette[2], "#f4b942"),
  ];

  return (
    <div
      className={cn(
        "grain relative h-full w-full overflow-hidden bg-black",
        className,
      )}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at ${20 + (index % 3) * 25}% 15%, ${c2}55 0%, transparent 45%), radial-gradient(140% 120% at 80% 100%, ${c1} 0%, ${c0} 70%)`,
          animation: playing ? "kenburns 6s ease-out forwards" : undefined,
          transformOrigin: index % 2 === 0 ? "top left" : "bottom right",
        }}
        aria-hidden
      />
      {/* Layered silhouette shapes for depth */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: `linear-gradient(to top, ${c0}ee, transparent)`,
        }}
        aria-hidden
      />
      <div
        className="absolute -bottom-8 left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-[50%] blur-2xl"
        style={{ background: `${c2}33` }}
        aria-hidden
      />
    </div>
  );
}
