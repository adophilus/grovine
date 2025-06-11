import type { Recipe } from "@/types";

export const serializeRecipe = (recipe: Recipe.Selectable) => ({
  ...recipe,
  price: Number.parseFloat(recipe.price)
})
