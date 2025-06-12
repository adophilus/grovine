import type { Recipe } from "@/types";

export const serializeRecipe = (recipe: Recipe.Selectable) => {
  return {
    ...recipe,
    price: Number.parseFloat(recipe.price)
  }
}
