const API_URL = 'https://haix.ai/api';

// Generate unique table names to avoid conflicts
const randomString = Math.random().toString(36).substring(2, 10);
const RECIPES_TABLE = `recipes_${randomString}`;
const INGREDIENTS_TABLE = `ingredients_${randomString}`;
const CUISINES_TABLE = `cuisines_${randomString}`;

// Define data interfaces
export interface Recipe {
  id: number;
  title: string;
  description: string;
  cuisine: string;
  cooking_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string[];
  ingredients: string[];
  image_url?: string;
  rating?: number;
  created_at: string;
}

export interface Ingredient {
  id: number;
  name: string;
  category: string;
  unit: string;
  in_pantry: boolean;
  created_at: string;
}

export interface Cuisine {
  id: number;
  name: string;
  description: string;
  popular_dishes: string[];
  created_at: string;
}

// Recipe generation function
export async function generateRecipe(
  availableIngredients: string[],
  cuisine: string,
  maxCookingTime: number
): Promise<Recipe> {
  const response = await fetch(`${API_URL}/${RECIPES_TABLE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ingredients: availableIngredients,
      cuisine,
      max_cooking_time: maxCookingTime
    }),
  });
  if (!response.ok) throw new Error('Failed to generate recipe');
  return response.json();
}

// Get all recipes
export async function getRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${API_URL}/${RECIPES_TABLE}`);
  if (!response.ok) throw new Error('Failed to fetch recipes');
  return response.json();
}

// Create a new recipe
export async function createRecipe(recipe: Omit<Recipe, 'id' | 'created_at'>): Promise<Recipe> {
  const response = await fetch(`${API_URL}/${RECIPES_TABLE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });
  if (!response.ok) throw new Error('Failed to create recipe');
  return response.json();
}

// Get ingredients
export async function getIngredients(): Promise<Ingredient[]> {
  const response = await fetch(`${API_URL}/${INGREDIENTS_TABLE}`);
  if (!response.ok) throw new Error('Failed to fetch ingredients');
  return response.json();
}

// Add ingredient
export async function addIngredient(ingredient: Omit<Ingredient, 'id' | 'created_at'>): Promise<Ingredient> {
  const response = await fetch(`${API_URL}/${INGREDIENTS_TABLE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ingredient),
  });
  if (!response.ok) throw new Error('Failed to add ingredient');
  return response.json();
}

// Update ingredient
export async function updateIngredient(id: number, updates: Partial<Ingredient>): Promise<Ingredient> {
  const response = await fetch(`${API_URL}/${INGREDIENTS_TABLE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error('Failed to update ingredient');
  return response.json();
}

// Get cuisines
export async function getCuisines(): Promise<Cuisine[]> {
  const response = await fetch(`${API_URL}/${CUISINES_TABLE}`);
  if (!response.ok) throw new Error('Failed to fetch cuisines');
  return response.json();
}