import { Result } from 'true-myth'
import type { FoodRecipeRepository } from '../../repository'
import type { Request, Response } from './types'

class ListFoodRecipeUseCase {
  constructor(private readonly recipeRepository: FoodRecipeRepository) {}

  async execute(
    payload: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const listRecipesResult = await this.recipeRepository.findMany(payload)
    if (listRecipesResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const recipes = listRecipesResult.value

    return Result.ok({ code: 'LIST', data: recipes })
  }
}

export default ListFoodRecipeUseCase
