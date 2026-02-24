const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface NutritionResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: 'high' | 'medium' | 'low';
  items: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number }>;
}

export interface WorkoutResult {
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    sets: Array<{ reps: number; weight: number }>;
  }>;
  confidence: 'high' | 'medium' | 'low';
}

async function callGemini(apiKey: string, parts: unknown[]): Promise<string> {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      (err as any)?.error?.message ||
        `Gemini API error: ${response.status} ${response.statusText}`,
    );
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text as string;
}

export async function analyzeNutritionWithGemini(
  description: string,
  apiKey: string,
): Promise<NutritionResult> {
  const prompt = `You are a precise nutrition analyst. Analyze the nutritional content of the following food and return accurate macros.

Food: "${description}"

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "calories": <number>,
  "protein": <number in grams>,
  "carbs": <number in grams>,
  "fat": <number in grams>,
  "items": [{"name": "<item>", "calories": <number>, "protein": <number>, "carbs": <number>, "fat": <number>}],
  "confidence": "<high|medium|low>"
}

Rules:
- Use standard nutritional databases for accuracy
- If quantities are specified (e.g. "200g"), use them
- If no quantity is specified, assume a standard serving size
- confidence is "high" if quantities are given, "medium" if estimated, "low" if very vague
- Round all values to nearest integer`;

  const text = await callGemini(apiKey, [{ text: prompt }]);
  const result = JSON.parse(text) as NutritionResult;
  return result;
}

export async function analyzeNutritionImageWithGemini(
  imageBase64: string,
  description: string,
  apiKey: string,
): Promise<NutritionResult> {
  const mimeType = imageBase64.startsWith('data:image/png') ? 'image/png' : 'image/jpeg';
  const base64Data = imageBase64.split(',')[1];

  const prompt = `You are a precise nutrition analyst. Analyze the food in this image${description ? ` (additional context: ${description})` : ''} and return accurate nutritional macros.

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "calories": <number>,
  "protein": <number in grams>,
  "carbs": <number in grams>,
  "fat": <number in grams>,
  "items": [{"name": "<item>", "calories": <number>, "protein": <number>, "carbs": <number>, "fat": <number>}],
  "confidence": "<high|medium|low>"
}

Rules:
- Estimate portion sizes from the image if possible
- If the description provides quantity info, prioritize that
- confidence is "high" if you can clearly identify and estimate all items, "medium" if estimating, "low" if unclear
- Round all values to nearest integer`;

  const text = await callGemini(apiKey, [
    { text: prompt },
    { inlineData: { mimeType, data: base64Data } },
  ]);
  const result = JSON.parse(text) as NutritionResult;
  return result;
}

export async function parseWorkoutWithGemini(
  description: string,
  apiKey: string,
): Promise<WorkoutResult> {
  const prompt = `You are a fitness expert. Parse the following workout description and extract exercises, sets, reps and weights.

Workout: "${description}"

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "exercises": [
    {
      "exerciseName": "<Proper Exercise Name>",
      "sets": [
        {"reps": <number>, "weight": <number in kg>}
      ]
    }
  ],
  "confidence": "<high|medium|low>"
}

Rules:
- Use proper exercise names (e.g., "Bench Press", "Shoulder Press", "Lateral Raises", "Squat")
- Convert lbs to kg if needed (1 lb = 0.453592 kg), round to 1 decimal
- If weight is not mentioned, use 0
- If reps are not mentioned for a set, use 10 as default
- confidence is "high" if all details are clear, "medium" if some details missing, "low" if very vague
- Parse all exercises mentioned, even if in the same sentence`;

  const text = await callGemini(apiKey, [{ text: prompt }]);
  const result = JSON.parse(text) as { exercises: any[]; confidence: 'high' | 'medium' | 'low' };

  return {
    confidence: result.confidence,
    exercises: result.exercises.map((ex: any) => {
      const safeName = ex.exerciseName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return {
        exerciseId: `gemini-${safeName}-${Date.now()}`,
        exerciseName: ex.exerciseName,
        sets: (ex.sets || [{ reps: 10, weight: 0 }]).map((s: any) => ({
          reps: Math.round(s.reps || 10),
          weight: Math.round((s.weight || 0) * 10) / 10,
        })),
      };
    }),
  };
}
