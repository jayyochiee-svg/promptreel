import { generateObject } from "ai";
import { buildDemoFilm } from "@/lib/demo-engine";
import {
  ASPECT_RATIOS,
  FilmSchema,
  STYLE_PRESETS,
  TONE_PRESETS,
  type AspectKey,
  type GenerateRequest,
} from "@/lib/schema";

export const maxDuration = 30;

const MODEL = process.env.OPENAI_MODEL
  ? `openai/${process.env.OPENAI_MODEL}`
  : "openai/gpt-4.1-mini";

function sanitize(body: unknown): GenerateRequest {
  const b = (body ?? {}) as Record<string, unknown>;
  const concept =
    typeof b.concept === "string" ? b.concept.slice(0, 600).trim() : "";
  const style =
    typeof b.style === "string" && STYLE_PRESETS.includes(b.style as never)
      ? b.style
      : "Cinematic";
  const tone =
    typeof b.tone === "string" && TONE_PRESETS.includes(b.tone as never)
      ? b.tone
      : "Epic";
  const aspect =
    typeof b.aspect === "string" && b.aspect in ASPECT_RATIOS
      ? (b.aspect as AspectKey)
      : "16:9";
  const shotCount =
    typeof b.shotCount === "number"
      ? Math.min(10, Math.max(3, Math.round(b.shotCount)))
      : 5;
  return { concept, style, tone, aspect, shotCount };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const request = sanitize(body);
  if (!request.concept) {
    return Response.json(
      { error: "Please describe your film concept first." },
      { status: 400 },
    );
  }

  const demoForced = process.env.DISABLE_DEMO_ENGINE === "1" ? false : undefined;

  // If demo is explicitly forced-off we still attempt real generation;
  // otherwise we try real generation and gracefully fall back to the demo engine.
  try {
    const { object } = await generateObject({
      model: MODEL,
      schema: FilmSchema,
      system:
        "You are a visionary film director and cinematographer. You break a concept into a vivid, shootable storyboard. Return exactly the requested number of shots. Palettes must be valid 6-digit hex colors that evoke each shot's mood.",
      prompt: `Create a short film storyboard.\n\nConcept: ${request.concept}\nVisual style: ${request.style}\nEmotional tone: ${request.tone}\nNumber of shots: ${request.shotCount}\n\nMake every shot distinct in framing, camera movement, and lighting so the reel feels dynamic.`,
    });

    // Enforce the requested shot count when the model over/under-delivers.
    let shots = object.shots;
    if (shots.length > request.shotCount) {
      shots = shots.slice(0, request.shotCount);
    }

    return Response.json({
      film: { ...object, shots },
      demo: false,
      aspect: request.aspect,
    });
  } catch (error) {
    console.log(
      "[v0] Falling back to demo engine:",
      error instanceof Error ? error.message : String(error),
    );
    if (demoForced === false) {
      // Real generation was required but failed; surface a soft error via demo flag.
    }
    return Response.json({
      film: buildDemoFilm(request),
      demo: true,
      aspect: request.aspect,
    });
  }
}
