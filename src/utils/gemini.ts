const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface GeminiNutritionResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: Array<{ name: string; quantity?: number; calories: number; protein: number; carbs: number; fat: number }>;
  confidence: 'high' | 'medium' | 'low';
}

export interface GeminiWorkoutResult {
  exercises: Array<{
    exerciseName: string;
    sets: Array<{ reps: number; weight: number }>;
  }>;
  confidence: 'high' | 'medium' | 'low';
}

function buildNutritionPrompt(description: string): string {
  return `You are a nutrition expert. Analyze the following food description and return nutritional information as JSON.

Food description: "${description}"

Return ONLY a valid JSON object with no markdown formatting, no code blocks, just plain JSON:
{
  "calories": <total calories as integer>,
  "protein": <total protein in grams as number with 1 decimal>,
  "carbs": <total carbs in grams as number with 1 decimal>,
  "fat": <total fat in grams as number with 1 decimal>,
  "confidence": <"high" if foods are clearly identifiable, "medium" if estimates, "low" if very vague>,
  "items": [
    {
      "name": "<food item name>",
      "calories": <calories as integer>,
      "protein": <protein in grams>,
      "carbs": <carbs in grams>,
      "fat": <fat in grams>
    }
  ]
}

Be accurate with quantities if specified (e.g., "100g chicken breast" = 165 cal). Round calories to nearest integer, macros to 1 decimal.`;
}

function buildWorkoutPrompt(description: string): string {
  return `You are a fitness expert. Parse the following workout description and return structured data as JSON.

Workout description: "${description}"

Return ONLY a valid JSON object with no markdown formatting, no code blocks, just plain JSON:
{
  "confidence": <"high" if exercises clearly identified, "medium" if partial, "low" if unclear>,
  "exercises": [
    {
      "exerciseName": "<proper exercise name, e.g. Bench Press, Squat>",
      "sets": [
        { "reps": <number of reps as integer>, "weight": <weight in kg as number, 0 if bodyweight> }
      ]
    }
  ]
}

Rules:
- Convert lbs to kg (multiply by 0.453592)
- If sets/reps not specified, default to 3 sets of 10 reps at 0 kg
- If only one set is mentioned, create one set entry
- Use proper exercise names (capitalized)`;
}

async function callGeminiAPI(
  apiKey: string,
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>
): Promise<string> {
  const response = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = (err as { error?: { message?: string } })?.error?.message || response.statusText;
    throw new Error(`Gemini API error: ${msg}`);
  }

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return text;
}

function parseJSON<T>(text: string): T {
  // Strip markdown code blocks if present
  const cleaned = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
  return JSON.parse(cleaned) as T;
}

export async function analyzeNutritionWithGemini(
  description: string,
  apiKey: string,
  imageBase64?: string,
  imageMimeType?: string
): Promise<GeminiNutritionResult> {
  const prompt = buildNutritionPrompt(description);
  const parts: Parameters<typeof callGeminiAPI>[1] = [];

  if (imageBase64 && imageMimeType) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
      },
    });
    parts.push({
      text: `${prompt}\n\nAlso use the provided image to identify what food is shown and estimate quantities if not specified in the description.`,
    });
  } else {
    parts.push({ text: prompt });
  }

  const raw = await callGeminiAPI(apiKey, parts);
  const result = parseJSON<GeminiNutritionResult>(raw);

  return {
    calories: Math.round(result.calories ?? 0),
    protein: Math.round((result.protein ?? 0) * 10) / 10,
    carbs: Math.round((result.carbs ?? 0) * 10) / 10,
    fat: Math.round((result.fat ?? 0) * 10) / 10,
    confidence: result.confidence ?? 'medium',
    items: (result.items ?? []).map(({ name, quantity, calories, protein, carbs, fat }) => ({
      name,
      quantity: quantity ?? 1,
      calories: Math.round(calories ?? 0),
      protein: Math.round((protein ?? 0) * 10) / 10,
      carbs: Math.round((carbs ?? 0) * 10) / 10,
      fat: Math.round((fat ?? 0) * 10) / 10,
    })),
  };
}

export async function parseWorkoutWithGemini(
  description: string,
  apiKey: string
): Promise<GeminiWorkoutResult> {
  const raw = await callGeminiAPI(apiKey, [{ text: buildWorkoutPrompt(description) }]);
  const result = parseJSON<GeminiWorkoutResult>(raw);

  return {
    confidence: result.confidence ?? 'medium',
    exercises: (result.exercises ?? []).map((ex) => ({
      exerciseName: ex.exerciseName || 'Unknown',
      sets: (ex.sets ?? []).map((s) => ({
        reps: Math.max(1, Math.round(s.reps ?? 10)),
        weight: Math.max(0, Math.round((s.weight ?? 0) * 10) / 10),
      })),
    })),
  };
}
