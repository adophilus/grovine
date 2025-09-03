import { Result, Unit } from 'true-myth'
import type { FoodRecipeRepository } from '../repository'
import type { RecipeUserLikeRepository } from '../repository/recipe-user-like'
import type { RecipeUserRatingRepository } from '../repository/recipe-user-rating'
import type RecipeService from './interface'
import type { RecipeServiceError } from './interface'

class RecipeServiceImpl implements RecipeService {
  constructor(
    private recipeRepository: FoodRecipeRepository,
    private recipeUserLikeRepository: RecipeUserLikeRepository,
    private recipeUserRatingRepository: RecipeUserRatingRepository
  ) {}

  public async handleLikeToggle(
    recipeId: string,
    userId: string
  ): Promise<Result<Unit, RecipeServiceError>> {
    const findRecipe = await this.recipeRepository.findById(recipeId)
    if (findRecipe.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    if (!findRecipe.value) {
      return Result.err('ERR_RECIPE_NOT_FOUND')
    }

    const toggleResult = await this.recipeUserLikeRepository.toggleLikeById(
      recipeId,
      userId
    )
    if (toggleResult.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }

    // Update cached likes count
    const likesCount =
      await this.recipeUserLikeRepository.countLikesByRecipeId(recipeId)
    if (likesCount.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    const dislikesCount =
      await this.recipeUserLikeRepository.countDislikesByRecipeId(recipeId)
    if (dislikesCount.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    await this.recipeRepository.updateById(recipeId, {
      likes: likesCount.value,
      dislikes: dislikesCount.value
    })

    return Result.ok(Unit)
  }

  public async handleDislikeToggle(
    recipeId: string,
    userId: string
  ): Promise<Result<Unit, RecipeServiceError>> {
    const findRecipe = await this.recipeRepository.findById(recipeId)
    if (findRecipe.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    if (!findRecipe.value) {
      return Result.err('ERR_RECIPE_NOT_FOUND')
    }

    const toggleResult = await this.recipeUserLikeRepository.toggleDislikeById(
      recipeId,
      userId
    )
    if (toggleResult.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }

    // Update cached likes count
    const likesCount =
      await this.recipeUserLikeRepository.countLikesByRecipeId(recipeId)
    if (likesCount.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    const dislikesCount =
      await this.recipeUserLikeRepository.countDislikesByRecipeId(recipeId)
    if (dislikesCount.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    await this.recipeRepository.updateById(recipeId, {
      likes: likesCount.value,
      dislikes: dislikesCount.value
    })

    return Result.ok(Unit)
  }

  public async handleRating(
    recipeId: string,
    userId: string,
    rating: number
  ): Promise<Result<Unit, RecipeServiceError>> {
    const findRecipe = await this.recipeRepository.findById(recipeId)
    if (findRecipe.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    if (!findRecipe.value) {
      return Result.err('ERR_RECIPE_NOT_FOUND')
    }

    const rateResult = await this.recipeUserRatingRepository.rateById(
      recipeId,
      userId,
      rating
    )
    if (rateResult.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }

    // Update cached average rating
    const averageRating =
      await this.recipeUserRatingRepository.getAverageRatingByRecipeId(recipeId)
    if (averageRating.isErr) {
      return Result.err('ERR_UNEXPECTED')
    }
    await this.recipeRepository.updateById(recipeId, {
      rating: averageRating.value.toString()
    })

    return Result.ok(Unit)
  }
}

export default RecipeServiceImpl
