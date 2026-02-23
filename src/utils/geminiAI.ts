import { GoogleGenerativeAI } from '@google/generative-ai';
import { WorkoutExercise, ExerciseSet } from '@/types';

// Reuse the same result interfaces from the existing AI utils so callers stay compatible
export interface NutritionResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  items: Array<{
    name: string;
    quantity: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }>;
  confidence: 'high' | 'medium' | 'low';
}

export interface ParsedWorkout {
  exercises: WorkoutExercise[];
  confidence: 'high' | 'medium' | 'low';
  rawParsed: Array<{
    exerciseName: string;
    sets: ExerciseSet[];
    matched: boolean;
    originalText: string;
  }>;
}

function getClient(apiKey: string) {
  return new GoogleGenerativeAI(apiKey);
}

/** Parse a freeform workout description using Gemini */
export async function parseWorkoutWithGemini(
  input: string,
  apiKey: string
): Promise<ParsedWorkout> {
  const genAI = getClient(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a fitness assistant. Parse the following workout description into structured JSON.

Input: "${input}"

Return ONLY valid JSON with no markdown, no code blocks, no explanation. The JSON must follow this exact schema:
{
  "exercises": [
    {
      "exerciseId": "string (kebab-case id, e.g. 'bench-press')",
      "exerciseName": "string (human readable name)",
      "sets": [
        { "reps": number, "weight": number }
      ]
    }
  ],
  "confidence": "high" | "medium" | "low"
}

Rules:
- weight is always in kg; convert lbs to kg if needed (1 lb = 0.4536 kg)
- If the number of sets is given but not individual reps, use the same reps value for each set
- If reps are not mentioned, default to 10
- If weight is not mentioned, default to 0
- confidence is "high" if all exercises were clearly identified, "medium" if some were ambiguous, "low" if nothing could be parsed
- exerciseId should be kebab-case of the exercise name`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip potential markdown fences
  const jsonText = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');

  const parsed = JSON.parse(jsonText) as {
    exercises: WorkoutExercise[];
    confidence: 'high' | 'medium' | 'low';
  };

  return {
    exercises: parsed.exercises || [],
    confidence: parsed.confidence || 'low',
    rawParsed: (parsed.exercises || []).map((ex) => ({
      exerciseName: ex.exerciseName,
      sets: ex.sets,
      matched: true,
      originalText: input,
    })),
  };
}

/** Analyze nutrition from a text description, optionally with a food photo (base64) */
export async function analyzeNutritionWithGemini(
  description: string,
  apiKey: string,
  imageBase64?: string
): Promise<NutritionResult> {
  const genAI = getClient(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are a nutrition expert. Analyze the following food description and return accurate nutritional information.

${imageBase64 ? 'A food photo has also been provided. Use it to help identify the foods and estimate portions.' : ''}
Description: "${description}"

Return ONLY valid JSON with no markdown, no code blocks, no explanation. The JSON must follow this exact schema:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "items": [
    {
      "name": "string",
      "quantity": number,
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    }
  ],
  "confidence": "high" | "medium" | "low"
}

Rules:
- All macros are in grams
- calories is kcal
- quantity is in grams (or ml for liquids)
- confidence is "high" if quantities were explicit, "medium" if estimated, "low" if very uncertain
- Sum calories/protein/carbs/fat from items to produce the totals`;

  if (imageBase64) {
    // Remove the data URL prefix if present
    const base64Data = imageBase64.replace(/^data:[^;]+;base64,/, '');
    const mimeMatch = imageBase64.match(/^data:([^;]+);base64,/);
    const mimeType = (mimeMatch?.[1] || 'image/jpeg') as string;

    const contents: Parameters<typeof model.generateContent>[0] = [
      { text: prompt },
      {
        inlineData: {
          mimeType,
          data: base64Data,
        },
      },
    ];

    const result = await model.generateContent(contents);
    return parseNutritionResponse(result.response.text().trim());
  }

  const result = await model.generateContent(prompt);
  return parseNutritionResponse(result.response.text().trim());
}

function parseNutritionResponse(text: string): NutritionResult {
  const jsonText = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  const parsed = JSON.parse(jsonText) as NutritionResult;
  return {
    calories: Math.round(parsed.calories || 0),
    protein: Math.round((parsed.protein || 0) * 10) / 10,
    carbs: Math.round((parsed.carbs || 0) * 10) / 10,
    fat: Math.round((parsed.fat || 0) * 10) / 10,
    items: parsed.items || [],
    confidence: parsed.confidence || 'low',
  };
}
