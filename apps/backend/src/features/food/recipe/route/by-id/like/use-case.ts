import { Result } from 'true-myth'
import type { User } from '@/types'
import type { RecipeService } from '../../../service'
import type { Request, Response } from './types'

class LikeRecipeByIdUseCase {
  constructor(private recipeService: RecipeService) {}

  async execute(
    payload: Request.Path,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.recipeService.handleLikeToggle(
      payload.id,
      user.id
    )

    if (result.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'RECIPE_LIKED'
    })
  }
}

export default LikeRecipeByIdUseCase
