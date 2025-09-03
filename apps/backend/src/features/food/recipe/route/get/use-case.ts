import { Result } from 'true-myth'
import type { FoodRecipeRepository } from '../../repository'
import type { Request, Response } from './types'

class GetFoodRecipeUseCase {
  constructor(private readonly recipeRepository: FoodRecipeRepository) {}

  async execute(
    payload: Request.Params
  ): Promise<Result<Response.Success, Response.Error>> {
    const findRecipeResult = await this.recipeRepository.findById(payload.id)
    if (findRecipeResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const recipe = findRecipeResult.value
    if (!recipe) {
      return Result.err({
        code: 'ERR_RECIPE_NOT_FOUND'
      })
    }

    return Result.ok({ code: 'RECIPE_FOUND', data: recipe })
  }
}

export default GetFoodRecipeUseCase
