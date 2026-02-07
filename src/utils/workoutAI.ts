import { EXERCISES } from '@/data/exercises';
import { WorkoutExercise, ExerciseSet } from '@/types';

interface ParsedWorkout {
  exercises: WorkoutExercise[];
  confidence: 'high' | 'medium' | 'low';
  rawParsed: Array<{
    exerciseName: string;
    sets: ExerciseSet[];
    matched: boolean;
    originalText: string;
  }>;
}

// Common exercise name variations and aliases
const EXERCISE_ALIASES: Record<string, string> = {
  'bench': 'bench-press',
  'flat bench': 'bench-press',
  'barbell bench': 'bench-press',
  'incline bench': 'incline-bench-press',
  'decline bench': 'decline-bench-press',
  'db bench': 'dumbbell-bench-press',
  'dumbbell bench': 'dumbbell-bench-press',
  'db press': 'dumbbell-bench-press',
  'chest press': 'machine-chest-press',
  'pushup': 'push-ups',
  'push up': 'push-ups',
  'pushups': 'push-ups',
  'dip': 'chest-dips',
  'dips': 'chest-dips',
  'fly': 'dumbbell-flyes',
  'flies': 'dumbbell-flyes',
  'flyes': 'dumbbell-flyes',
  'cable fly': 'cable-crossover',
  'cable flies': 'cable-crossover',
  'crossover': 'cable-crossover',
  
  // Back
  'pull up': 'pull-ups',
  'pullup': 'pull-ups',
  'pullups': 'pull-ups',
  'chin up': 'chin-ups',
  'chinup': 'chin-ups',
  'chinups': 'chin-ups',
  'lat pull': 'lat-pulldown',
  'lat pulldown': 'lat-pulldown',
  'pulldown': 'lat-pulldown',
  'row': 'barbell-row',
  'barbell row': 'barbell-row',
  'bent over row': 'barbell-row',
  'db row': 'dumbbell-row',
  'dumbbell row': 'dumbbell-row',
  'one arm row': 'dumbbell-row',
  'cable row': 'cable-row',
  'seated row': 'seated-row',
  't bar': 't-bar-row',
  't-bar': 't-bar-row',
  'face pull': 'face-pulls',
  'facepull': 'face-pulls',
  'dead': 'deadlift',
  'deadlifts': 'deadlift',
  'dl': 'deadlift',
  
  // Shoulders
  'ohp': 'overhead-press',
  'overhead': 'overhead-press',
  'military press': 'overhead-press',
  'shoulder press': 'dumbbell-shoulder-press',
  'db shoulder press': 'dumbbell-shoulder-press',
  'arnold': 'arnold-press',
  'lateral raise': 'lateral-raises',
  'side raise': 'lateral-raises',
  'lat raise': 'lateral-raises',
  'side lateral': 'lateral-raises',
  'front raise': 'front-raises',
  'rear delt': 'rear-delt-flyes',
  'reverse fly': 'rear-delt-flyes',
  'shrug': 'shrugs',
  'upright row': 'upright-rows',
  
  // Biceps
  'curl': 'barbell-curl',
  'curls': 'barbell-curl',
  'barbell curl': 'barbell-curl',
  'bb curl': 'barbell-curl',
  'db curl': 'dumbbell-curl',
  'dumbbell curl': 'dumbbell-curl',
  'hammer': 'hammer-curl',
  'hammer curls': 'hammer-curl',
  'preacher': 'preacher-curl',
  'concentration curl': 'concentration-curl',
  'ez curl': 'ez-bar-curl',
  'ez bar curl': 'ez-bar-curl',
  
  // Triceps
  'pushdown': 'tricep-pushdown',
  'tricep pushdown': 'tricep-pushdown',
  'push down': 'tricep-pushdown',
  'rope pushdown': 'rope-pushdown',
  'rope extension': 'rope-pushdown',
  'skull crusher': 'skull-crushers',
  'skullcrusher': 'skull-crushers',
  'skullcrushers': 'skull-crushers',
  'overhead extension': 'overhead-tricep-extension',
  'tricep extension': 'overhead-tricep-extension',
  'kickback': 'dumbbell-kickbacks',
  'kickbacks': 'dumbbell-kickbacks',
  'close grip': 'close-grip-bench',
  'close grip bench': 'close-grip-bench',
  'cgbp': 'close-grip-bench',
  'diamond pushup': 'diamond-push-ups',
  
  // Legs
  'squat': 'squats',
  'squats': 'squats',
  'back squat': 'squats',
  'front squat': 'front-squats',
  'goblet': 'goblet-squat',
  'goblet squat': 'goblet-squat',
  'leg press': 'leg-press',
  'hack': 'hack-squat',
  'hack squat': 'hack-squat',
  'leg extension': 'leg-extension',
  'leg ext': 'leg-extension',
  'lunge': 'walking-lunges',
  'lunges': 'walking-lunges',
  'walking lunge': 'walking-lunges',
  'bulgarian': 'bulgarian-split-squat',
  'bss': 'bulgarian-split-squat',
  'split squat': 'bulgarian-split-squat',
  'rdl': 'romanian-deadlift',
  'romanian': 'romanian-deadlift',
  'stiff leg': 'stiff-leg-deadlift',
  'sldl': 'stiff-leg-deadlift',
  'leg curl': 'lying-leg-curl',
  'hamstring curl': 'lying-leg-curl',
  'lying leg curl': 'lying-leg-curl',
  'seated leg curl': 'seated-leg-curl',
  'hip thrust': 'hip-thrust',
  'glute bridge': 'glute-bridge',
  'calf raise': 'standing-calf-raise',
  'calf': 'standing-calf-raise',
  'calves': 'standing-calf-raise',
  'seated calf': 'seated-calf-raise',
  
  // Core
  'crunch': 'crunches',
  'sit up': 'decline-sit-ups',
  'situp': 'decline-sit-ups',
  'situps': 'decline-sit-ups',
  'plank': 'planks',
  'leg raise': 'hanging-leg-raises',
  'hanging leg raise': 'hanging-leg-raises',
  'ab wheel': 'ab-wheel-rollout',
  'russian twist': 'russian-twists',
  
  // Cardio
  'run': 'running',
  'treadmill': 'running',
  'bike': 'cycling',
  'cycle': 'cycling',
  'row machine': 'rowing',
  'rower': 'rowing',
  'stairmaster': 'stair-climber',
  'stairs': 'stair-climber',
  'jump rope': 'jump-rope',
  'skipping': 'jump-rope',
};

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Find best matching exercise using multiple strategies
function findExercise(name: string): { id: string; name: string } | null {
  const normalized = name.toLowerCase().trim();
  
  if (!normalized || normalized.length < 2) return null;
  
  // Check aliases first (exact match)
  if (EXERCISE_ALIASES[normalized]) {
    const exercise = EXERCISES.find(e => e.id === EXERCISE_ALIASES[normalized]);
    if (exercise) return { id: exercise.id, name: exercise.name };
  }
  
  // Check partial alias match
  for (const [alias, id] of Object.entries(EXERCISE_ALIASES)) {
    if (normalized.includes(alias) || alias.includes(normalized)) {
      const exercise = EXERCISES.find(e => e.id === id);
      if (exercise) return { id: exercise.id, name: exercise.name };
    }
  }
  
  // Direct match on ID
  const directMatch = EXERCISES.find(e => e.id === normalized.replace(/\s+/g, '-'));
  if (directMatch) return { id: directMatch.id, name: directMatch.name };
  
  // Direct match on name
  const nameMatch = EXERCISES.find(e => e.name.toLowerCase() === normalized);
  if (nameMatch) return { id: nameMatch.id, name: nameMatch.name };
  
  // Partial match on name (both directions)
  const partialMatch = EXERCISES.find(e => 
    e.name.toLowerCase().includes(normalized) || 
    normalized.includes(e.name.toLowerCase())
  );
  if (partialMatch) return { id: partialMatch.id, name: partialMatch.name };
  
  // Word-based matching
  const words = normalized.split(/\s+/).filter(w => w.length >= 2);
  if (words.length > 0) {
    for (const exercise of EXERCISES) {
      const exerciseWords = exercise.name.toLowerCase().split(/[\s-]+/);
      const matchCount = words.filter(w => 
        exerciseWords.some(ew => ew.includes(w) || w.includes(ew) || levenshteinDistance(w, ew) <= 2)
      ).length;
      if (matchCount >= Math.max(1, words.length * 0.5)) {
        return { id: exercise.id, name: exercise.name };
      }
    }
  }
  
  // Fuzzy match with Levenshtein distance
  let bestMatch: { id: string; name: string } | null = null;
  let bestDistance = Infinity;
  
  for (const exercise of EXERCISES) {
    const distance = levenshteinDistance(normalized, exercise.name.toLowerCase());
    const threshold = Math.max(3, exercise.name.length * 0.4);
    if (distance < bestDistance && distance <= threshold) {
      bestDistance = distance;
      bestMatch = { id: exercise.id, name: exercise.name };
    }
  }
  
  return bestMatch;
}

// Parse weight from text (handles kg, lbs, pounds)
function parseWeight(text: string): number {
  // Look for weight patterns
  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilos?)\b/i,
    /(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)\b/i,
    /(?:on|at|@)\s*(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilos?)?\b/i,
    /(?:on|at|@)\s*(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)\b/i,
    /(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilos?|lbs?|pounds?)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let weight = parseFloat(match[1]);
      // Check if it's pounds and convert to kg
      if (/lbs?|pounds?/i.test(text.slice(text.indexOf(match[1])))) {
        weight = Math.round(weight * 0.453592 * 10) / 10;
      }
      return weight;
    }
  }
  
  // Fallback: look for any number followed by weight unit
  const fallback = text.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|kilos?|lbs?|pounds?)/i);
  if (fallback) {
    let weight = parseFloat(fallback[1]);
    if (/lbs?|pounds?/i.test(fallback[2])) {
      weight = Math.round(weight * 0.453592 * 10) / 10;
    }
    return weight;
  }
  
  return 0;
}

// Extract all individual set reps from text
// Handles many formats:
// - "set 1:6 reps, set 2:5 reps"
// - "set 1 was 6 reps, set 2 was 5"
// - "set 1 had 6, set 2 had 5"
// - "6, 5, 5, 4 reps"
// - "got 8, 7, 6"
function extractIndividualReps(text: string): number[] {
  const reps: number[] = [];
  
  // Pattern 1: "set 1:6" or "set 1: 6" or "set 1 : 6 reps"
  const colonPattern = /set\s*(\d+)\s*:\s*(\d+)\s*(?:reps?)?/gi;
  let colonMatches = [...text.matchAll(colonPattern)];
  if (colonMatches.length > 0) {
    colonMatches.sort((a, b) => parseInt(a[1]) - parseInt(b[1]));
    return colonMatches.map(m => parseInt(m[2]));
  }
  
  // Pattern 2: "set 1 was/had/did 6 reps"
  const setWasPattern = /set\s*(\d+)\s*(?:was|had|did|got|=)\s*(\d+)\s*(?:reps?)?/gi;
  let setWasMatches = [...text.matchAll(setWasPattern)];
  if (setWasMatches.length > 0) {
    setWasMatches.sort((a, b) => parseInt(a[1]) - parseInt(b[1]));
    return setWasMatches.map(m => parseInt(m[2]));
  }
  
  // Pattern 3: "1st set 6 reps, 2nd set 5 reps"
  const ordinalPattern = /(\d+)(?:st|nd|rd|th)\s*set\s*(?:was|had|did|got|:)?\s*(\d+)\s*(?:reps?)?/gi;
  let ordinalMatches = [...text.matchAll(ordinalPattern)];
  if (ordinalMatches.length > 0) {
    ordinalMatches.sort((a, b) => parseInt(a[1]) - parseInt(b[1]));
    return ordinalMatches.map(m => parseInt(m[2]));
  }
  
  // Pattern 4: "got 8, 7, 6" or "did 8, 7, 6 reps" or just "8, 7, 6 reps"
  const gotPattern = /(?:got|did|had|reps?:?\s*)?(\d+)(?:\s*,\s*(\d+))+\s*(?:reps?)?/i;
  const gotMatch = text.match(gotPattern);
  if (gotMatch) {
    // Extract all numbers from this sequence
    const numPattern = /\d+/g;
    const fullMatch = text.match(/(?:got|did|had|reps?:?\s*)?(\d+(?:\s*,\s*\d+)+)\s*(?:reps?)?/i);
    if (fullMatch) {
      const numbers = fullMatch[1].match(numPattern);
      if (numbers && numbers.length > 1) {
        return numbers.map(n => parseInt(n));
      }
    }
  }
  
  // Pattern 5: "8-7-6" or "8/7/6"
  const dashPattern = /(\d+)\s*[-\/]\s*(\d+)(?:\s*[-\/]\s*(\d+))?(?:\s*[-\/]\s*(\d+))?(?:\s*[-\/]\s*(\d+))?/;
  const dashMatch = text.match(dashPattern);
  if (dashMatch) {
    const nums = dashMatch.slice(1).filter(Boolean).map(n => parseInt(n));
    if (nums.length > 1) {
      return nums;
    }
  }
  
  return reps;
}

// Parse the number of sets
function parseSetCount(text: string): number {
  // "4 sets" or "4 set"
  const setsMatch = text.match(/(\d+)\s*sets?/i);
  if (setsMatch) return parseInt(setsMatch[1]);
  
  // "4x10" - first number is sets
  const xPattern = text.match(/(\d+)\s*[x×]\s*\d+/i);
  if (xPattern) return parseInt(xPattern[1]);
  
  return 0;
}

// Parse default reps per set
function parseDefaultReps(text: string): number {
  // "3x10" or "3 x 10" - second number is reps
  const xPattern = text.match(/\d+\s*[x×]\s*(\d+)/i);
  if (xPattern) return parseInt(xPattern[1]);
  
  // "sets of 10"
  const setsOfPattern = text.match(/sets?\s*of\s*(\d+)/i);
  if (setsOfPattern) return parseInt(setsOfPattern[1]);
  
  // "10 reps each" or "10 reps"
  const repsPattern = text.match(/(\d+)\s*reps?\s*(?:each)?/i);
  if (repsPattern) return parseInt(repsPattern[1]);
  
  // "each 10" or "all 10"
  const eachPattern = text.match(/(?:each|all)\s*(\d+)/i);
  if (eachPattern) return parseInt(eachPattern[1]);
  
  return 0;
}

// Build sets array from parsed data
function buildSets(text: string, weight: number): ExerciseSet[] {
  const sets: ExerciseSet[] = [];
  
  // First, try to get individual rep counts
  const individualReps = extractIndividualReps(text);
  
  if (individualReps.length > 0) {
    // We have individual rep counts
    for (const rep of individualReps) {
      sets.push({ reps: rep, weight });
    }
    return sets;
  }
  
  // Otherwise, parse set count and default reps
  const setCount = parseSetCount(text);
  const defaultReps = parseDefaultReps(text);
  
  if (setCount > 0) {
    const reps = defaultReps || 10; // Default to 10 if not specified
    for (let i = 0; i < setCount; i++) {
      sets.push({ reps, weight });
    }
    return sets;
  }
  
  // Last resort: just one set with default reps
  if (defaultReps > 0) {
    sets.push({ reps: defaultReps, weight });
    return sets;
  }
  
  // No set info at all, return empty
  return sets;
}

// Clean up exercise name from the text
function extractExerciseName(text: string): string {
  let name = text
    // Remove weight patterns
    .replace(/\d+(?:\.\d+)?\s*(?:kg|kgs|kilos?|lbs?|pounds?)\b/gi, '')
    // Remove set patterns: "4 sets", "set 1:6 reps", etc.
    .replace(/set\s*\d+\s*[:\s]*\d+\s*(?:reps?)?/gi, '')
    .replace(/\d+\s*sets?\b/gi, '')
    // Remove rep patterns
    .replace(/\d+\s*(?:reps?|repetitions?)\b/gi, '')
    .replace(/\d+\s*[x×]\s*\d+/gi, '') // 3x10
    // Remove "all on", "at", "each", etc.
    .replace(/\b(?:all\s+)?(?:on|at|@)\s+\d+/gi, '')
    .replace(/\b(?:of|with|for|each|per|had|was|did|got|every|all)\b/gi, '')
    // Remove standalone numbers
    .replace(/\b\d+\b/g, '')
    // Remove commas, colons, extra spaces
    .replace(/[,:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  return name;
}

// Split input into exercise blocks
function splitIntoExerciseBlocks(input: string): string[] {
  // First, try to split by semicolon - explicit separator
  if (input.includes(';')) {
    return input.split(';').map(s => s.trim()).filter(s => s.length > 0);
  }
  
  // Try to split by "then", "also", "next" - explicit transitions
  const transitionPattern = /\b(?:then|also|next|after that|afterwards|followed by)\b/i;
  if (transitionPattern.test(input)) {
    return input.split(transitionPattern).map(s => s.trim()).filter(s => s.length > 0);
  }
  
  // Otherwise, keep as single block
  return [input.trim()];
}

// Main parsing function - completely rewritten to be more flexible
export function parseWorkoutDescription(input: string): ParsedWorkout {
  const result: ParsedWorkout = {
    exercises: [],
    confidence: 'high',
    rawParsed: []
  };
  
  if (!input || input.trim().length < 3) {
    result.confidence = 'low';
    return result;
  }
  
  // Split into exercise blocks
  const blocks = splitIntoExerciseBlocks(input);
  let unmatchedCount = 0;
  
  for (const block of blocks) {
    if (block.length < 3) continue;
    
    // Parse weight
    const weight = parseWeight(block);
    
    // Build sets
    const sets = buildSets(block, weight);
    
    // Extract exercise name
    const exerciseName = extractExerciseName(block);
    
    if (!exerciseName || exerciseName.length < 2) {
      continue;
    }
    
    // Try to find matching exercise
    const matchedExercise = findExercise(exerciseName);
    
    if (matchedExercise) {
      result.exercises.push({
        exerciseId: matchedExercise.id,
        exerciseName: matchedExercise.name,
        sets: sets.length > 0 ? sets : [{ reps: 10, weight: 0 }]
      });
      result.rawParsed.push({
        exerciseName: matchedExercise.name,
        sets,
        matched: true,
        originalText: block
      });
    } else {
      // Create custom exercise with the extracted name
      const cleanName = exerciseName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      
      if (cleanName.length >= 3) {
        result.exercises.push({
          exerciseId: `custom-${cleanName.toLowerCase().replace(/\s+/g, '-')}`,
          exerciseName: cleanName,
          sets: sets.length > 0 ? sets : [{ reps: 10, weight: 0 }]
        });
        result.rawParsed.push({
          exerciseName: cleanName,
          sets,
          matched: false,
          originalText: block
        });
        unmatchedCount++;
      }
    }
  }
  
  // Determine confidence
  if (result.exercises.length === 0) {
    result.confidence = 'low';
  } else if (unmatchedCount === 0) {
    result.confidence = 'high';
  } else if (result.exercises.length > unmatchedCount) {
    result.confidence = 'medium';
  } else {
    result.confidence = 'low';
  }
  
  return result;
}

// Format parsed workout for display
export function formatParsedWorkout(parsed: ParsedWorkout): string {
  if (parsed.exercises.length === 0) {
    return "Couldn't parse any exercises. Try: '3 sets of bench press at 60kg, 10 reps each'";
  }
  
  return parsed.exercises.map(ex => {
    const setsInfo = ex.sets.map((s, i) => `Set ${i + 1}: ${s.weight}kg × ${s.reps}`).join(', ');
    return `${ex.exerciseName}: ${setsInfo}`;
  }).join('\n');
}
