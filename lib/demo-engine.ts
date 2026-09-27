import type { Film, GenerateRequest, Shot } from "./schema";
import { SHOT_TYPES } from "./schema";

// Deterministic pseudo-random generator so the same concept yields the same reel.
function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTES: string[][] = [
  ["#0b1e3f", "#2b5f9e", "#f4b942"],
  ["#1a0b2e", "#7b2cbf", "#e0aaff"],
  ["#2b0a0a", "#e5484d", "#ffb703"],
  ["#04231b", "#2a9d8f", "#e9f5db"],
  ["#1c1c1e", "#495057", "#f8f9fa"],
  ["#3a0ca3", "#f72585", "#4cc9f0"],
  ["#2d1b00", "#bc6c25", "#fefae0"],
  ["#03071e", "#370617", "#dc2f02"],
];

const CAMERA_MOVES = [
  "slow dolly in",
  "static locked-off",
  "handheld drift",
  "sweeping crane up",
  "smooth tracking left",
  "subtle push-in",
  "orbiting arc",
  "whip pan",
];

const LIGHTING = [
  "golden hour backlight",
  "hard chiaroscuro key",
  "soft diffused overcast",
  "neon rim light",
  "moonlit blue wash",
  "practical tungsten glow",
  "high-key studio flood",
  "silhouetted against fog",
];

const SHOT_TEMPLATES = [
  (s: string) => `Establishing view sets the world of ${s}.`,
  (s: string) => `A lone figure moves through the heart of ${s}.`,
  (s: string) => `Tension builds as details of ${s} come into focus.`,
  (s: string) => `A quiet, intimate beat inside ${s}.`,
  (s: string) => `The scale of ${s} is revealed in a single sweep.`,
  (s: string) => `Fragments and textures of ${s} flash by.`,
  (s: string) => `The turning point arrives at the edge of ${s}.`,
  (s: string) => `A final, lingering resolution over ${s}.`,
];

const SHOT_TITLES = [
  "Opening frame",
  "The arrival",
  "Rising tension",
  "Quiet moment",
  "The reveal",
  "Montage",
  "Turning point",
  "Final frame",
  "Aftermath",
  "Fade out",
];

export function buildDemoFilm(req: GenerateRequest): Film {
  const seed = hashString(
    `${req.concept}|${req.style}|${req.tone}|${req.shotCount}`,
  );
  const rand = mulberry32(seed);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  const subject = req.concept.trim().replace(/\.$/, "") || "an untitled dream";
  const shortSubject =
    subject.length > 42 ? subject.slice(0, 42).trim() + "…" : subject;

  const count = Math.min(10, Math.max(3, req.shotCount));
  const shots: Shot[] = Array.from({ length: count }, (_, i) => {
    const paletteBase = PALETTES[(seed + i * 3) % PALETTES.length];
    return {
      title: SHOT_TITLES[i % SHOT_TITLES.length],
      description: SHOT_TEMPLATES[i % SHOT_TEMPLATES.length](shortSubject),
      shotType: SHOT_TYPES[Math.floor(rand() * SHOT_TYPES.length)],
      cameraMove: pick(CAMERA_MOVES),
      lighting: pick(LIGHTING),
      duration: 3 + Math.floor(rand() * 6),
      palette: paletteBase,
    };
  });

  const titleWords = subject.split(/\s+/).slice(0, 4).join(" ");
  const title =
    titleWords.charAt(0).toUpperCase() + titleWords.slice(1) || "Untitled Reel";

  return {
    title,
    logline: `A ${req.tone.toLowerCase()} ${req.style.toLowerCase()} piece exploring ${shortSubject}.`,
    genre: `${req.style} · ${req.tone}`,
    shots,
  };
}
