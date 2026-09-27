import { z } from "zod";

export const SHOT_TYPES = [
  "Wide",
  "Medium",
  "Close-up",
  "Extreme close-up",
  "Aerial",
  "Tracking",
  "POV",
  "Over-the-shoulder",
  "Dutch angle",
  "Macro",
] as const;

export const ASPECT_RATIOS = {
  "21:9": { label: "Cinemascope", ratio: 21 / 9 },
  "16:9": { label: "Widescreen", ratio: 16 / 9 },
  "4:3": { label: "Classic", ratio: 4 / 3 },
  "1:1": { label: "Square", ratio: 1 },
  "9:16": { label: "Vertical", ratio: 9 / 16 },
} as const;

export type AspectKey = keyof typeof ASPECT_RATIOS;

export const STYLE_PRESETS = [
  "Cinematic",
  "Film noir",
  "Documentary",
  "Anime",
  "Retro VHS",
  "Cyberpunk",
  "Dreamlike",
  "Stop-motion",
] as const;

export const TONE_PRESETS = [
  "Epic",
  "Melancholic",
  "Playful",
  "Tense",
  "Serene",
  "Mysterious",
] as const;

export const ShotSchema = z.object({
  title: z.string().describe("A short 2-4 word label for the shot"),
  description: z
    .string()
    .describe("A vivid one-sentence description of what happens in the shot"),
  shotType: z.enum(SHOT_TYPES).describe("The framing / camera shot type"),
  cameraMove: z
    .string()
    .describe("Camera movement, e.g. 'slow dolly in', 'static', 'handheld pan'"),
  lighting: z
    .string()
    .describe("Lighting description, e.g. 'golden hour backlight'"),
  duration: z
    .number()
    .min(2)
    .max(12)
    .describe("Duration of the shot in seconds"),
  palette: z
    .array(z.string())
    .length(3)
    .describe("Three hex colors (e.g. '#1a2b3c') representing the shot's mood"),
});

export const FilmSchema = z.object({
  title: z.string().describe("An evocative title for the film"),
  logline: z.string().describe("A single compelling sentence summarizing the film"),
  genre: z.string().describe("A short genre label, e.g. 'Sci-fi thriller'"),
  shots: z.array(ShotSchema).min(3).max(10),
});

export type Shot = z.infer<typeof ShotSchema>;
export type Film = z.infer<typeof FilmSchema>;

export interface GenerateRequest {
  concept: string;
  style: string;
  tone: string;
  aspect: AspectKey;
  shotCount: number;
}

export interface GenerateResponse {
  film: Film;
  demo: boolean;
  aspect: AspectKey;
}
