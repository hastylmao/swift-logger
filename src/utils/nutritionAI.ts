// Comprehensive food database with nutritional info per 100g AND per common serving
// per100g is used when user specifies grams, otherwise serving is used
const FOOD_DATABASE: Record<string, { 
  calories: number; 
  protein: number; 
  carbs: number; 
  fat: number; 
  serving: string;
  per100g?: { calories: number; protein: number; carbs: number; fat: number };
}> = {
  // Eggs
  'egg': { calories: 72, protein: 6, carbs: 0.4, fat: 5, serving: '1 large', per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11 } },
  'egg white': { calories: 17, protein: 3.6, carbs: 0.2, fat: 0.1, serving: '1 large', per100g: { calories: 52, protein: 11, carbs: 0.7, fat: 0.2 } },
  'egg yolk': { calories: 55, protein: 2.7, carbs: 0.6, fat: 4.5, serving: '1 large', per100g: { calories: 322, protein: 16, carbs: 3.6, fat: 27 } },
  'omelette': { calories: 94, protein: 6.5, carbs: 0.6, fat: 7, serving: '1 egg worth', per100g: { calories: 154, protein: 11, carbs: 1, fat: 12 } },
  'scrambled eggs': { calories: 91, protein: 6.1, carbs: 1, fat: 6.7, serving: '1 egg worth', per100g: { calories: 149, protein: 10, carbs: 1.6, fat: 11 } },
  'boiled egg': { calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, serving: '1 large', per100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11 } },
  'fried egg': { calories: 90, protein: 6.3, carbs: 0.4, fat: 7, serving: '1 large', per100g: { calories: 196, protein: 14, carbs: 0.8, fat: 15 } },
  
  // Bread & Grains
  'toast': { calories: 75, protein: 2.5, carbs: 13, fat: 1, serving: '1 slice', per100g: { calories: 265, protein: 9, carbs: 49, fat: 3.2 } },
  'bread': { calories: 79, protein: 2.7, carbs: 15, fat: 1, serving: '1 slice', per100g: { calories: 265, protein: 9, carbs: 49, fat: 3.2 } },
  'whole wheat bread': { calories: 81, protein: 4, carbs: 14, fat: 1.1, serving: '1 slice', per100g: { calories: 247, protein: 13, carbs: 41, fat: 3.4 } },
  'rice': { calories: 206, protein: 4.3, carbs: 45, fat: 0.4, serving: '1 cup cooked', per100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 } },
  'brown rice': { calories: 216, protein: 5, carbs: 45, fat: 1.8, serving: '1 cup cooked', per100g: { calories: 112, protein: 2.6, carbs: 24, fat: 0.9 } },
  'pasta': { calories: 220, protein: 8, carbs: 43, fat: 1.3, serving: '1 cup cooked', per100g: { calories: 131, protein: 5, carbs: 25, fat: 1.1 } },
  'oatmeal': { calories: 158, protein: 6, carbs: 27, fat: 3.2, serving: '1 cup cooked', per100g: { calories: 68, protein: 2.4, carbs: 12, fat: 1.4 } },
  'oats': { calories: 158, protein: 6, carbs: 27, fat: 3.2, serving: '1 cup cooked', per100g: { calories: 389, protein: 17, carbs: 66, fat: 7 } },
  'quinoa': { calories: 222, protein: 8, carbs: 39, fat: 3.6, serving: '1 cup cooked', per100g: { calories: 120, protein: 4.4, carbs: 21, fat: 1.9 } },
  'bagel': { calories: 245, protein: 10, carbs: 48, fat: 1.5, serving: '1 medium', per100g: { calories: 257, protein: 10, carbs: 50, fat: 1.6 } },
  'croissant': { calories: 231, protein: 4.7, carbs: 26, fat: 12, serving: '1 medium', per100g: { calories: 406, protein: 8, carbs: 46, fat: 21 } },
  'pancake': { calories: 86, protein: 2.5, carbs: 11, fat: 3.5, serving: '1 medium', per100g: { calories: 227, protein: 7, carbs: 28, fat: 10 } },
  'waffle': { calories: 218, protein: 5.9, carbs: 25, fat: 11, serving: '1 round', per100g: { calories: 291, protein: 8, carbs: 33, fat: 15 } },
  'tortilla': { calories: 104, protein: 2.5, carbs: 18, fat: 2.5, serving: '1 medium', per100g: { calories: 237, protein: 6, carbs: 38, fat: 7 } },
  'naan': { calories: 262, protein: 9, carbs: 45, fat: 5, serving: '1 piece', per100g: { calories: 290, protein: 9, carbs: 50, fat: 5.5 } },
  'roti': { calories: 104, protein: 3, carbs: 18, fat: 2.5, serving: '1 piece', per100g: { calories: 300, protein: 9, carbs: 52, fat: 7 } },
  'chapati': { calories: 104, protein: 3, carbs: 18, fat: 2.5, serving: '1 piece', per100g: { calories: 300, protein: 9, carbs: 52, fat: 7 } },
  'paratha': { calories: 180, protein: 4, carbs: 24, fat: 8, serving: '1 piece', per100g: { calories: 326, protein: 7, carbs: 44, fat: 14 } },
  
  // Dairy
  'milk': { calories: 103, protein: 8, carbs: 12, fat: 2.4, serving: '1 cup', per100g: { calories: 42, protein: 3.4, carbs: 5, fat: 1 } },
  'whole milk': { calories: 149, protein: 8, carbs: 12, fat: 8, serving: '1 cup', per100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3 } },
  'skim milk': { calories: 83, protein: 8, carbs: 12, fat: 0.2, serving: '1 cup', per100g: { calories: 34, protein: 3.4, carbs: 5, fat: 0.1 } },
  'cheese': { calories: 113, protein: 7, carbs: 0.4, fat: 9, serving: '1 oz', per100g: { calories: 402, protein: 25, carbs: 1.3, fat: 33 } },
  'cheddar cheese': { calories: 113, protein: 7, carbs: 0.4, fat: 9.3, serving: '1 oz', per100g: { calories: 402, protein: 25, carbs: 1.3, fat: 33 } },
  'mozzarella': { calories: 85, protein: 6, carbs: 0.6, fat: 6.3, serving: '1 oz', per100g: { calories: 280, protein: 28, carbs: 2.2, fat: 17 } },
  'cottage cheese': { calories: 163, protein: 28, carbs: 6, fat: 2.3, serving: '1 cup', per100g: { calories: 98, protein: 11, carbs: 3.4, fat: 4.3 } },
  'greek yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '1 cup', per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 } },
  'yogurt': { calories: 100, protein: 17, carbs: 6, fat: 0.7, serving: '1 cup', per100g: { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 } },
  'butter': { calories: 102, protein: 0.1, carbs: 0, fat: 11.5, serving: '1 tbsp', per100g: { calories: 717, protein: 0.9, carbs: 0.1, fat: 81 } },
  'cream cheese': { calories: 99, protein: 1.7, carbs: 1.6, fat: 10, serving: '1 oz', per100g: { calories: 342, protein: 6, carbs: 5.5, fat: 34 } },
  'paneer': { calories: 265, protein: 18, carbs: 3.6, fat: 21, serving: '100g', per100g: { calories: 265, protein: 18, carbs: 3.6, fat: 21 } },
  
  // Meats - these are already per 100g so per100g equals the base values
  'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
  'chicken thigh': { calories: 209, protein: 26, carbs: 0, fat: 10.9, serving: '100g', per100g: { calories: 209, protein: 26, carbs: 0, fat: 10.9 } },
  'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
  'grilled chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g', per100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
  'beef': { calories: 250, protein: 26, carbs: 0, fat: 15, serving: '100g', per100g: { calories: 250, protein: 26, carbs: 0, fat: 15 } },
  'ground beef': { calories: 250, protein: 26, carbs: 0, fat: 15, serving: '100g', per100g: { calories: 250, protein: 26, carbs: 0, fat: 15 } },
  'steak': { calories: 271, protein: 26, carbs: 0, fat: 18, serving: '100g', per100g: { calories: 271, protein: 26, carbs: 0, fat: 18 } },
  'pork': { calories: 242, protein: 27, carbs: 0, fat: 14, serving: '100g', per100g: { calories: 242, protein: 27, carbs: 0, fat: 14 } },
  'bacon': { calories: 42, protein: 3, carbs: 0.1, fat: 3.3, serving: '1 slice', per100g: { calories: 541, protein: 37, carbs: 1.4, fat: 42 } },
  'turkey': { calories: 135, protein: 30, carbs: 0, fat: 1, serving: '100g', per100g: { calories: 135, protein: 30, carbs: 0, fat: 1 } },
  'lamb': { calories: 294, protein: 25, carbs: 0, fat: 21, serving: '100g', per100g: { calories: 294, protein: 25, carbs: 0, fat: 21 } },
  'mutton': { calories: 294, protein: 25, carbs: 0, fat: 21, serving: '100g', per100g: { calories: 294, protein: 25, carbs: 0, fat: 21 } },
  'sausage': { calories: 301, protein: 12, carbs: 2, fat: 27, serving: '100g', per100g: { calories: 301, protein: 12, carbs: 2, fat: 27 } },
  'ham': { calories: 145, protein: 21, carbs: 1.5, fat: 6, serving: '100g', per100g: { calories: 145, protein: 21, carbs: 1.5, fat: 6 } },
  
  // Fish & Seafood - already per 100g
  'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g', per100g: { calories: 208, protein: 20, carbs: 0, fat: 13 } },
  'tuna': { calories: 132, protein: 28, carbs: 0, fat: 1.3, serving: '100g', per100g: { calories: 132, protein: 28, carbs: 0, fat: 1.3 } },
  'shrimp': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, serving: '100g', per100g: { calories: 99, protein: 24, carbs: 0.2, fat: 0.3 } },
  'fish': { calories: 136, protein: 20, carbs: 0, fat: 6, serving: '100g', per100g: { calories: 136, protein: 20, carbs: 0, fat: 6 } },
  'cod': { calories: 82, protein: 18, carbs: 0, fat: 0.7, serving: '100g', per100g: { calories: 82, protein: 18, carbs: 0, fat: 0.7 } },
  'tilapia': { calories: 96, protein: 20, carbs: 0, fat: 1.7, serving: '100g', per100g: { calories: 96, protein: 20, carbs: 0, fat: 1.7 } },
  'prawns': { calories: 99, protein: 24, carbs: 0.2, fat: 0.3, serving: '100g', per100g: { calories: 99, protein: 24, carbs: 0.2, fat: 0.3 } },
  'crab': { calories: 83, protein: 18, carbs: 0, fat: 1, serving: '100g', per100g: { calories: 83, protein: 18, carbs: 0, fat: 1 } },
  'lobster': { calories: 89, protein: 19, carbs: 0.5, fat: 0.9, serving: '100g', per100g: { calories: 89, protein: 19, carbs: 0.5, fat: 0.9 } },
  
  // Vegetables
  'broccoli': { calories: 55, protein: 3.7, carbs: 11, fat: 0.6, serving: '1 cup', per100g: { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 } },
  'spinach': { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, serving: '1 cup', per100g: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 } },
  'lettuce': { calories: 5, protein: 0.5, carbs: 1, fat: 0.1, serving: '1 cup', per100g: { calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2 } },
  'tomato': { calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, serving: '1 medium', per100g: { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2 } },
  'potato': { calories: 161, protein: 4.3, carbs: 37, fat: 0.2, serving: '1 medium', per100g: { calories: 77, protein: 2, carbs: 17, fat: 0.1 } },
  'sweet potato': { calories: 103, protein: 2.3, carbs: 24, fat: 0.1, serving: '1 medium', per100g: { calories: 86, protein: 1.6, carbs: 20, fat: 0.1 } },
  'carrot': { calories: 25, protein: 0.6, carbs: 6, fat: 0.1, serving: '1 medium', per100g: { calories: 41, protein: 0.9, carbs: 10, fat: 0.2 } },
  'onion': { calories: 44, protein: 1.2, carbs: 10, fat: 0.1, serving: '1 medium', per100g: { calories: 40, protein: 1.1, carbs: 9, fat: 0.1 } },
  'bell pepper': { calories: 24, protein: 0.9, carbs: 6, fat: 0.2, serving: '1 medium', per100g: { calories: 31, protein: 1, carbs: 6, fat: 0.3 } },
  'cucumber': { calories: 16, protein: 0.7, carbs: 4, fat: 0.1, serving: '1 cup', per100g: { calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1 } },
  'mushroom': { calories: 15, protein: 2.2, carbs: 2.3, fat: 0.2, serving: '1 cup', per100g: { calories: 22, protein: 3.1, carbs: 3.3, fat: 0.3 } },
  'corn': { calories: 96, protein: 3.4, carbs: 21, fat: 1.5, serving: '1 ear', per100g: { calories: 86, protein: 3.2, carbs: 19, fat: 1.2 } },
  'peas': { calories: 118, protein: 8, carbs: 21, fat: 0.6, serving: '1 cup', per100g: { calories: 81, protein: 5, carbs: 14, fat: 0.4 } },
  'green beans': { calories: 31, protein: 1.8, carbs: 7, fat: 0.1, serving: '1 cup', per100g: { calories: 31, protein: 1.8, carbs: 7, fat: 0.2 } },
  'cabbage': { calories: 22, protein: 1.1, carbs: 5.2, fat: 0.1, serving: '1 cup', per100g: { calories: 25, protein: 1.3, carbs: 6, fat: 0.1 } },
  'cauliflower': { calories: 27, protein: 2.1, carbs: 5.3, fat: 0.3, serving: '1 cup', per100g: { calories: 25, protein: 1.9, carbs: 5, fat: 0.3 } },
  'asparagus': { calories: 27, protein: 3, carbs: 5.2, fat: 0.2, serving: '1 cup', per100g: { calories: 20, protein: 2.2, carbs: 3.9, fat: 0.1 } },
  'zucchini': { calories: 21, protein: 1.5, carbs: 3.9, fat: 0.4, serving: '1 cup', per100g: { calories: 17, protein: 1.2, carbs: 3.1, fat: 0.3 } },
  'eggplant': { calories: 35, protein: 1, carbs: 8.6, fat: 0.2, serving: '1 cup', per100g: { calories: 25, protein: 1, carbs: 6, fat: 0.2 } },
  'avocado': { calories: 234, protein: 2.9, carbs: 12, fat: 21, serving: '1 medium', per100g: { calories: 160, protein: 2, carbs: 9, fat: 15 } },
  
  // Fruits
  'apple': { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, serving: '1 medium', per100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 } },
  'banana': { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, serving: '1 medium', per100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 } },
  'orange': { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, serving: '1 medium', per100g: { calories: 47, protein: 0.9, carbs: 12, fat: 0.1 } },
  'grapes': { calories: 62, protein: 0.6, carbs: 16, fat: 0.3, serving: '1 cup', per100g: { calories: 69, protein: 0.7, carbs: 18, fat: 0.2 } },
  'strawberry': { calories: 49, protein: 1, carbs: 12, fat: 0.5, serving: '1 cup', per100g: { calories: 32, protein: 0.7, carbs: 8, fat: 0.3 } },
  'strawberries': { calories: 49, protein: 1, carbs: 12, fat: 0.5, serving: '1 cup', per100g: { calories: 32, protein: 0.7, carbs: 8, fat: 0.3 } },
  'blueberry': { calories: 85, protein: 1.1, carbs: 21, fat: 0.5, serving: '1 cup', per100g: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3 } },
  'blueberries': { calories: 85, protein: 1.1, carbs: 21, fat: 0.5, serving: '1 cup', per100g: { calories: 57, protein: 0.7, carbs: 14, fat: 0.3 } },
  'mango': { calories: 99, protein: 1.4, carbs: 25, fat: 0.6, serving: '1 cup', per100g: { calories: 60, protein: 0.8, carbs: 15, fat: 0.4 } },
  'pineapple': { calories: 82, protein: 0.9, carbs: 22, fat: 0.2, serving: '1 cup', per100g: { calories: 50, protein: 0.5, carbs: 13, fat: 0.1 } },
  'watermelon': { calories: 46, protein: 0.9, carbs: 11, fat: 0.2, serving: '1 cup', per100g: { calories: 30, protein: 0.6, carbs: 8, fat: 0.2 } },
  'peach': { calories: 59, protein: 1.4, carbs: 14, fat: 0.4, serving: '1 medium', per100g: { calories: 39, protein: 0.9, carbs: 10, fat: 0.3 } },
  'pear': { calories: 102, protein: 0.6, carbs: 27, fat: 0.2, serving: '1 medium', per100g: { calories: 57, protein: 0.4, carbs: 15, fat: 0.1 } },
  'cherry': { calories: 87, protein: 1.5, carbs: 22, fat: 0.3, serving: '1 cup', per100g: { calories: 63, protein: 1, carbs: 16, fat: 0.2 } },
  'cherries': { calories: 87, protein: 1.5, carbs: 22, fat: 0.3, serving: '1 cup', per100g: { calories: 63, protein: 1, carbs: 16, fat: 0.2 } },
  
  // Nuts & Seeds
  'almonds': { calories: 164, protein: 6, carbs: 6, fat: 14, serving: '1 oz', per100g: { calories: 579, protein: 21, carbs: 22, fat: 50 } },
  'peanuts': { calories: 161, protein: 7, carbs: 5, fat: 14, serving: '1 oz', per100g: { calories: 567, protein: 26, carbs: 16, fat: 49 } },
  'peanut butter': { calories: 94, protein: 4, carbs: 3, fat: 8, serving: '1 tbsp', per100g: { calories: 588, protein: 25, carbs: 20, fat: 50 } },
  'walnuts': { calories: 185, protein: 4.3, carbs: 4, fat: 18.5, serving: '1 oz', per100g: { calories: 654, protein: 15, carbs: 14, fat: 65 } },
  'cashews': { calories: 157, protein: 5, carbs: 9, fat: 12, serving: '1 oz', per100g: { calories: 553, protein: 18, carbs: 30, fat: 44 } },
  'pistachios': { calories: 159, protein: 6, carbs: 8, fat: 13, serving: '1 oz', per100g: { calories: 562, protein: 20, carbs: 28, fat: 45 } },
  'sunflower seeds': { calories: 165, protein: 5.5, carbs: 7, fat: 14, serving: '1 oz', per100g: { calories: 584, protein: 21, carbs: 20, fat: 51 } },
  'chia seeds': { calories: 137, protein: 4, carbs: 12, fat: 9, serving: '1 oz', per100g: { calories: 486, protein: 17, carbs: 42, fat: 31 } },
  'flax seeds': { calories: 150, protein: 5, carbs: 8, fat: 12, serving: '1 oz', per100g: { calories: 534, protein: 18, carbs: 29, fat: 42 } },
  
  // Legumes
  'lentils': { calories: 230, protein: 18, carbs: 40, fat: 0.8, serving: '1 cup cooked', per100g: { calories: 116, protein: 9, carbs: 20, fat: 0.4 } },
  'dal': { calories: 230, protein: 18, carbs: 40, fat: 0.8, serving: '1 cup', per100g: { calories: 116, protein: 9, carbs: 20, fat: 0.4 } },
  'chickpeas': { calories: 269, protein: 15, carbs: 45, fat: 4.2, serving: '1 cup', per100g: { calories: 164, protein: 9, carbs: 27, fat: 2.6 } },
  'black beans': { calories: 227, protein: 15, carbs: 41, fat: 0.9, serving: '1 cup', per100g: { calories: 132, protein: 9, carbs: 24, fat: 0.5 } },
  'kidney beans': { calories: 225, protein: 15, carbs: 40, fat: 0.9, serving: '1 cup', per100g: { calories: 127, protein: 9, carbs: 23, fat: 0.5 } },
  'tofu': { calories: 144, protein: 17, carbs: 3.5, fat: 9, serving: '1 cup', per100g: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 } },
  'hummus': { calories: 25, protein: 1.2, carbs: 2, fat: 1.4, serving: '1 tbsp', per100g: { calories: 166, protein: 8, carbs: 14, fat: 10 } },
  'edamame': { calories: 188, protein: 18.5, carbs: 14, fat: 8, serving: '1 cup', per100g: { calories: 121, protein: 12, carbs: 9, fat: 5 } },
  
  // Beverages
  'coffee': { calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup', per100g: { calories: 1, protein: 0.1, carbs: 0, fat: 0 } },
  'black coffee': { calories: 2, protein: 0.3, carbs: 0, fat: 0, serving: '1 cup', per100g: { calories: 1, protein: 0.1, carbs: 0, fat: 0 } },
  'latte': { calories: 135, protein: 8, carbs: 11, fat: 5, serving: '12 oz', per100g: { calories: 38, protein: 2.3, carbs: 3.1, fat: 1.4 } },
  'cappuccino': { calories: 80, protein: 4, carbs: 6, fat: 4, serving: '8 oz', per100g: { calories: 34, protein: 1.7, carbs: 2.5, fat: 1.7 } },
  'tea': { calories: 2, protein: 0, carbs: 0.5, fat: 0, serving: '1 cup', per100g: { calories: 1, protein: 0, carbs: 0.2, fat: 0 } },
  'orange juice': { calories: 112, protein: 1.7, carbs: 26, fat: 0.5, serving: '1 cup', per100g: { calories: 45, protein: 0.7, carbs: 10, fat: 0.2 } },
  'apple juice': { calories: 114, protein: 0.2, carbs: 28, fat: 0.3, serving: '1 cup', per100g: { calories: 46, protein: 0.1, carbs: 11, fat: 0.1 } },
  'smoothie': { calories: 200, protein: 6, carbs: 40, fat: 2, serving: '1 medium', per100g: { calories: 50, protein: 1.5, carbs: 10, fat: 0.5 } },
  'protein shake': { calories: 150, protein: 25, carbs: 5, fat: 2, serving: '1 scoop with water', per100g: { calories: 375, protein: 62, carbs: 12, fat: 5 } },
  'whey protein': { calories: 120, protein: 24, carbs: 3, fat: 1.5, serving: '1 scoop', per100g: { calories: 400, protein: 80, carbs: 10, fat: 5 } },
  'soda': { calories: 140, protein: 0, carbs: 39, fat: 0, serving: '12 oz can', per100g: { calories: 41, protein: 0, carbs: 11, fat: 0 } },
  'beer': { calories: 153, protein: 1.6, carbs: 13, fat: 0, serving: '12 oz', per100g: { calories: 43, protein: 0.5, carbs: 3.6, fat: 0 } },
  'wine': { calories: 125, protein: 0.1, carbs: 4, fat: 0, serving: '5 oz', per100g: { calories: 83, protein: 0.1, carbs: 2.6, fat: 0 } },
  
  // Fast Food / Common Meals
  'pizza': { calories: 285, protein: 12, carbs: 36, fat: 10, serving: '1 slice' },
  'burger': { calories: 354, protein: 20, carbs: 29, fat: 17, serving: '1 regular' },
  'hamburger': { calories: 354, protein: 20, carbs: 29, fat: 17, serving: '1 regular' },
  'cheeseburger': { calories: 410, protein: 23, carbs: 30, fat: 22, serving: '1 regular' },
  'french fries': { calories: 365, protein: 4, carbs: 48, fat: 17, serving: 'medium' },
  'fries': { calories: 365, protein: 4, carbs: 48, fat: 17, serving: 'medium' },
  'hot dog': { calories: 290, protein: 11, carbs: 24, fat: 17, serving: '1 with bun' },
  'sandwich': { calories: 350, protein: 15, carbs: 35, fat: 15, serving: '1 regular' },
  'wrap': { calories: 300, protein: 15, carbs: 30, fat: 12, serving: '1 regular' },
  'burrito': { calories: 450, protein: 18, carbs: 50, fat: 18, serving: '1 regular' },
  'taco': { calories: 210, protein: 9, carbs: 21, fat: 10, serving: '1 regular' },
  'sushi': { calories: 37, protein: 1.5, carbs: 7, fat: 0.2, serving: '1 piece' },
  'fried rice': { calories: 238, protein: 5.5, carbs: 34, fat: 9, serving: '1 cup' },
  'biryani': { calories: 290, protein: 12, carbs: 35, fat: 12, serving: '1 cup' },
  'curry': { calories: 200, protein: 15, carbs: 10, fat: 12, serving: '1 cup' },
  'butter chicken': { calories: 280, protein: 24, carbs: 8, fat: 17, serving: '1 cup' },
  'tikka masala': { calories: 280, protein: 24, carbs: 8, fat: 17, serving: '1 cup' },
  'noodles': { calories: 220, protein: 8, carbs: 40, fat: 3, serving: '1 cup' },
  'ramen': { calories: 380, protein: 10, carbs: 52, fat: 14, serving: '1 bowl' },
  'soup': { calories: 100, protein: 6, carbs: 12, fat: 3, serving: '1 cup' },
  'salad': { calories: 100, protein: 3, carbs: 10, fat: 5, serving: '1 bowl' },
  'caesar salad': { calories: 190, protein: 8, carbs: 8, fat: 14, serving: '1 bowl' },
  'pasta salad': { calories: 250, protein: 6, carbs: 35, fat: 10, serving: '1 cup' },
  
  // Snacks & Sweets
  'chips': { calories: 152, protein: 2, carbs: 15, fat: 10, serving: '1 oz' },
  'chocolate': { calories: 155, protein: 1.4, carbs: 17, fat: 9, serving: '1 oz' },
  'dark chocolate': { calories: 170, protein: 2.2, carbs: 13, fat: 12, serving: '1 oz' },
  'ice cream': { calories: 207, protein: 3.5, carbs: 24, fat: 11, serving: '1 cup' },
  'cookie': { calories: 78, protein: 0.9, carbs: 10, fat: 3.7, serving: '1 medium' },
  'brownie': { calories: 227, protein: 3, carbs: 36, fat: 9, serving: '1 piece' },
  'cake': { calories: 239, protein: 2.4, carbs: 35, fat: 11, serving: '1 slice' },
  'donut': { calories: 289, protein: 5, carbs: 33, fat: 16, serving: '1 medium' },
  'muffin': { calories: 377, protein: 6, carbs: 56, fat: 15, serving: '1 large' },
  'granola bar': { calories: 117, protein: 2.5, carbs: 19, fat: 4, serving: '1 bar' },
  'protein bar': { calories: 200, protein: 20, carbs: 20, fat: 7, serving: '1 bar' },
  'popcorn': { calories: 93, protein: 3, carbs: 19, fat: 1, serving: '3 cups' },
  'pretzel': { calories: 109, protein: 2.6, carbs: 23, fat: 0.8, serving: '1 oz' },
  'crackers': { calories: 77, protein: 1.6, carbs: 13, fat: 2, serving: '5 crackers' },
  
  // Indian Food
  'samosa': { calories: 262, protein: 4, carbs: 26, fat: 16, serving: '1 piece' },
  'pakora': { calories: 150, protein: 3, carbs: 15, fat: 9, serving: '4 pieces' },
  'dosa': { calories: 168, protein: 4, carbs: 30, fat: 4, serving: '1 medium' },
  'idli': { calories: 58, protein: 2, carbs: 12, fat: 0.4, serving: '1 piece' },
  'upma': { calories: 200, protein: 5, carbs: 30, fat: 7, serving: '1 cup' },
  'poha': { calories: 180, protein: 3, carbs: 35, fat: 4, serving: '1 cup' },
  'khichdi': { calories: 170, protein: 6, carbs: 30, fat: 3, serving: '1 cup' },
  'lassi': { calories: 160, protein: 6, carbs: 24, fat: 4, serving: '1 glass' },
  'raita': { calories: 80, protein: 4, carbs: 6, fat: 4, serving: '1 cup' },
  'chana masala': { calories: 240, protein: 12, carbs: 35, fat: 6, serving: '1 cup' },
  'palak paneer': { calories: 230, protein: 12, carbs: 8, fat: 18, serving: '1 cup' },
  'dal makhani': { calories: 260, protein: 12, carbs: 30, fat: 10, serving: '1 cup' },
  'aloo gobi': { calories: 150, protein: 4, carbs: 22, fat: 6, serving: '1 cup' },
  'chole': { calories: 240, protein: 12, carbs: 35, fat: 6, serving: '1 cup' },
};

// Unit conversion types
interface ParsedQuantity {
  amount: number;
  unit: 'serving' | 'grams' | 'ml' | 'oz' | 'cup' | 'tbsp' | 'tsp';
  originalUnit: string;
}

// Helper to extract quantity and unit from text
const extractQuantityAndUnit = (text: string): ParsedQuantity => {
  const normalizedText = text.toLowerCase().trim();
  
  // Pattern to match number followed by optional unit
  // Matches: "100g", "100 g", "100 grams", "100ml", "2 cups", "3 tbsp", etc.
  const patterns = [
    // Grams patterns
    { regex: /(\d+(?:\.\d+)?)\s*(?:g|grams?|gm)\b/i, unit: 'grams' as const },
    // Milliliters patterns  
    { regex: /(\d+(?:\.\d+)?)\s*(?:ml|milliliters?|millilitres?)\b/i, unit: 'ml' as const },
    // Ounces patterns
    { regex: /(\d+(?:\.\d+)?)\s*(?:oz|ounces?)\b/i, unit: 'oz' as const },
    // Cups patterns
    { regex: /(\d+(?:\.\d+)?)\s*(?:cups?)\b/i, unit: 'cup' as const },
    // Tablespoon patterns
    { regex: /(\d+(?:\.\d+)?)\s*(?:tbsp|tablespoons?)\b/i, unit: 'tbsp' as const },
    // Teaspoon patterns
    { regex: /(\d+(?:\.\d+)?)\s*(?:tsp|teaspoons?)\b/i, unit: 'tsp' as const },
    // Kilogram patterns (convert to grams)
    { regex: /(\d+(?:\.\d+)?)\s*(?:kg|kilograms?)\b/i, unit: 'grams' as const, multiplier: 1000 },
    // Liter patterns (convert to ml)
    { regex: /(\d+(?:\.\d+)?)\s*(?:l|liters?|litres?)\b/i, unit: 'ml' as const, multiplier: 1000 },
  ];
  
  for (const pattern of patterns) {
    const match = normalizedText.match(pattern.regex);
    if (match) {
      let amount = parseFloat(match[1]);
      if ('multiplier' in pattern && pattern.multiplier) {
        amount *= pattern.multiplier;
      }
      return { 
        amount, 
        unit: pattern.unit, 
        originalUnit: match[0].replace(match[1], '').trim() 
      };
    }
  }
  
  // No unit found, try to extract just a number (treat as servings)
  const numberMatch = normalizedText.match(/^(\d+(?:\.\d+)?)/);
  if (numberMatch) {
    return { 
      amount: parseFloat(numberMatch[1]), 
      unit: 'serving', 
      originalUnit: 'serving' 
    };
  }
  
  // Default to 1 serving
  return { amount: 1, unit: 'serving', originalUnit: 'serving' };
};

// Calculate multiplier based on unit and food data
const calculateMultiplier = (
  quantity: ParsedQuantity, 
  foodData: typeof FOOD_DATABASE[string]
): number => {
  const { amount, unit } = quantity;
  
  switch (unit) {
    case 'grams':
      // Use per100g data if available
      if (foodData.per100g) {
        return amount / 100;
      }
      // Fall back to estimating based on serving
      return amount / 100;
      
    case 'ml':
      // For liquids, ml is roughly equivalent to grams
      if (foodData.per100g) {
        return amount / 100;
      }
      return amount / 100;
      
    case 'oz':
      // 1 oz = 28.35 grams
      if (foodData.per100g) {
        return (amount * 28.35) / 100;
      }
      return amount; // Treat as servings if no per100g
      
    case 'cup':
      // Return amount as servings (most foods have cup as serving)
      return amount;
      
    case 'tbsp':
      // 1 tbsp is roughly 15g, or use as serving if that's the unit
      if (foodData.serving.includes('tbsp')) {
        return amount;
      }
      if (foodData.per100g) {
        return (amount * 15) / 100;
      }
      return amount;
      
    case 'tsp':
      // 1 tsp is roughly 5g
      if (foodData.serving.includes('tsp')) {
        return amount;
      }
      if (foodData.per100g) {
        return (amount * 5) / 100;
      }
      return amount;
      
    case 'serving':
    default:
      return amount;
  }
};

// Get nutrition values based on unit
const getNutritionValues = (
  quantity: ParsedQuantity,
  foodData: typeof FOOD_DATABASE[string]
): { calories: number; protein: number; carbs: number; fat: number } => {
  const { unit } = quantity;
  const multiplier = calculateMultiplier(quantity, foodData);
  
  // Use per100g data for gram/ml/oz measurements
  if ((unit === 'grams' || unit === 'ml' || unit === 'oz') && foodData.per100g) {
    return {
      calories: foodData.per100g.calories * multiplier,
      protein: foodData.per100g.protein * multiplier,
      carbs: foodData.per100g.carbs * multiplier,
      fat: foodData.per100g.fat * multiplier,
    };
  }
  
  // Use per-serving data
  return {
    calories: foodData.calories * multiplier,
    protein: foodData.protein * multiplier,
    carbs: foodData.carbs * multiplier,
    fat: foodData.fat * multiplier,
  };
};

// Find the best matching food item
const findFoodMatch = (query: string): { food: string; data: typeof FOOD_DATABASE[string] } | null => {
  // Remove quantity and units from query for better matching
  // This regex removes patterns like "100g", "100 grams", "200ml", "2 cups", etc.
  let cleanedQuery = query.toLowerCase().trim();
  
  // First, remove number+unit combinations (e.g., "100g", "200 grams", "50ml")
  cleanedQuery = cleanedQuery
    .replace(/(\d+(?:\.\d+)?)\s*(g|grams?|gm|ml|milliliters?|millilitres?|oz|ounces?|cups?|tbsp|tablespoons?|tsp|teaspoons?|kg|kilograms?|l|liters?|litres?)\b/gi, '')
    .trim();
  
  // Then remove any standalone numbers at the start (e.g., "2 eggs" -> "eggs")
  cleanedQuery = cleanedQuery
    .replace(/^\d+(?:\.\d+)?\s*/g, '')
    .trim();
  
  // Remove common words that aren't food
  cleanedQuery = cleanedQuery
    .replace(/\b(of|worth|piece|pieces|slice|slices|serving|servings|portion|portions|bowl|bowls|plate|plates|some|a|an|the)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // If nothing left after cleaning, try original
  const normalizedQuery = cleanedQuery || query.toLowerCase().replace(/\d+/g, '').trim();
  
  if (!normalizedQuery) {
    return null;
  }
  
  // Direct match
  if (FOOD_DATABASE[normalizedQuery]) {
    return { food: normalizedQuery, data: FOOD_DATABASE[normalizedQuery] };
  }
  
  // Sort foods by length (longer = more specific) to match "greek yogurt" before "yogurt"
  const sortedFoods = Object.entries(FOOD_DATABASE).sort((a, b) => b[0].length - a[0].length);
  
  // Check if query contains the food name
  for (const [food, data] of sortedFoods) {
    if (normalizedQuery.includes(food)) {
      return { food, data };
    }
  }
  
  // Check if food name contains the query
  for (const [food, data] of sortedFoods) {
    if (food.includes(normalizedQuery) && normalizedQuery.length >= 3) {
      return { food, data };
    }
  }
  
  // Fuzzy match - check if significant words match
  const words = normalizedQuery.split(/\s+/).filter(w => w.length >= 3);
  for (const [food, data] of sortedFoods) {
    const foodWords = food.split(/\s+/);
    for (const word of words) {
      for (const foodWord of foodWords) {
        if (foodWord.includes(word) || word.includes(foodWord)) {
          return { food, data };
        }
      }
    }
  }
  
  return null;
};

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

export const analyzeNutrition = (input: string): NutritionResult => {
  const result: NutritionResult = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    items: [],
    confidence: 'high',
  };
  
  // Split by common separators
  const parts = input.toLowerCase().split(/(?:,|and|with|plus|\+|&)/);
  let unmatchedCount = 0;
  
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    
    // Extract quantity and unit
    const quantity = extractQuantityAndUnit(trimmed);
    
    // Find matching food
    const match = findFoodMatch(trimmed);
    
    if (match) {
      // Get nutrition values based on unit type
      const nutrition = getNutritionValues(quantity, match.data);
      
      // Format display quantity
      let displayQuantity = quantity.amount;
      let displayUnit = '';
      if (quantity.unit === 'grams') {
        displayUnit = 'g';
      } else if (quantity.unit === 'ml') {
        displayUnit = 'ml';
      } else if (quantity.unit === 'oz') {
        displayUnit = 'oz';
      }
      
      const item = {
        name: match.food + (displayUnit ? ` (${quantity.amount}${displayUnit})` : ''),
        quantity: displayQuantity,
        calories: Math.round(nutrition.calories),
        protein: Math.round(nutrition.protein * 10) / 10,
        carbs: Math.round(nutrition.carbs * 10) / 10,
        fat: Math.round(nutrition.fat * 10) / 10,
      };
      
      result.items.push(item);
      result.calories += item.calories;
      result.protein += item.protein;
      result.carbs += item.carbs;
      result.fat += item.fat;
    } else {
      unmatchedCount++;
    }
  }
  
  // Set confidence based on matches
  if (unmatchedCount === 0 && result.items.length > 0) {
    result.confidence = 'high';
  } else if (result.items.length > unmatchedCount) {
    result.confidence = 'medium';
  } else {
    result.confidence = 'low';
  }
  
  // Round totals
  result.protein = Math.round(result.protein * 10) / 10;
  result.carbs = Math.round(result.carbs * 10) / 10;
  result.fat = Math.round(result.fat * 10) / 10;
  
  return result;
};
