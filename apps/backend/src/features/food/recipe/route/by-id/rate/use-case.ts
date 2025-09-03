import { Result } from 'true-myth'
import type { User } from '@/types'
import type { RecipeService } from '../../../service'
import type { Request, Response } from './types'

class RateRecipeByIdUseCase {
  constructor(private recipeService: RecipeService) {}

  async execute(
    payload: Request.Body & Request.Path,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.recipeService.handleRating(
      payload.id,
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
