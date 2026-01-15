import { useState, useEffect } from 'react';
import { 
  getRecipes, 
  createRecipe, 
  generateRecipe, 
  getIngredients, 
  addIngredient, 
  updateIngredient,
  getCuisines,
  type Recipe, 
  type Ingredient, 
  type Cuisine 
} from '../lib/api';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [recipesData, ingredientsData, cuisinesData] = await Promise.all([
        getRecipes(),
        getIngredients(),
        getCuisines()
      ]);
      setRecipes(recipesData);
      setIngredients(ingredientsData);
      setCuisines(cuisinesData);
    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function generateNewRecipe(
    availableIngredients: string[],
    cuisine: string,
    maxCookingTime: number
  ): Promise<Recipe> {
    try {
      const newRecipe = await generateRecipe(availableIngredients, cuisine, maxCookingTime);
      setRecipes([newRecipe, ...recipes]);
      return newRecipe;
    } catch (err: any) {
      console.error('Failed to generate recipe:', err);
      throw err;
    }
  }

  async function saveRecipe(recipe: Omit<Recipe, 'id' | 'created_at'>): Promise<Recipe> {
    try {
      const newRecipe = await createRecipe(recipe);
      setRecipes([newRecipe, ...recipes]);
      return newRecipe;
    } catch (err: any) {
      console.error('Failed to save recipe:', err);
      throw err;
    }
  }

  async function addNewIngredient(ingredient: Omit<Ingredient, 'id' | 'created_at'>): Promise<Ingredient> {
    try {
      const newIngredient = await addIngredient(ingredient);
      setIngredients([...ingredients, newIngredient]);
      return newIngredient;
    } catch (err: any) {
      console.error('Failed to add ingredient:', err);
      throw err;
    }
  }

  async function toggleIngredientInPantry(id: number, inPantry: boolean): Promise<void> {
    try {
      const updated = await updateIngredient(id, { in_pantry: inPantry });
      setIngredients(ingredients.map(ing => ing.id === id ? updated : ing));
    } catch (err: any) {
      console.error('Failed to update ingredient:', err);
      throw err;
    }
  }

  return {
    recipes,
    ingredients,
    cuisines,
    loading,
    error,
    generateNewRecipe,
    saveRecipe,
    addNewIngredient,
    toggleIngredientInPantry,
    refresh: loadData
  };
}