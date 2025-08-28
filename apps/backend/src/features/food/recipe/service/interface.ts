import type { Result, Unit } from 'true-myth'

export type RecipeServiceError = 'ERR_UNEXPECTED' | 'ERR_RECIPE_NOT_FOUND'

abstract class RecipeService {
  public abstract handleLikeToggle(
    recipeId: string,
    userId: string
  ): Promise<Result<Unit, RecipeServiceError>>

  public abstract handleDislikeToggle(
    recipeId: string,
    userId: string
  ): Promise<Result<Unit, RecipeServiceError>>

  public abstract handleRating(
    recipeId: string,
    userId: string,
    rating: number
  ): Promise<Result<Unit, RecipeServiceError>>
}

export default RecipeService
