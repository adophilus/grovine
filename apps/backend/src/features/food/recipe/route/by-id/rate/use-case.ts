import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { RecipeService } from '../../../service'
import type { User } from '@/types'

class RateRecipeByIdUseCase {
  constructor(private recipeService: RecipeService) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable,
    path: Request.Path
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.recipeService.handleRating(
      path.id,
      user.id,
      payload.rating
    )

    if (result.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'RECIPE_RATED'
    })
  }
}

export default RateRecipeByIdUseCase
