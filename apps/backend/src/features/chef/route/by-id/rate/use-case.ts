import { Result } from 'true-myth'
import type { User } from '@/types'
import type { ChefService } from '../../../service'
import type { Request, Response } from './types'

class RateChefProfileByIdUseCase {
  constructor(private chefService: ChefService) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable,
    path: Request.Path
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.chefService.handleRating(
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
      code: 'CHEF_PROFILE_RATED'
    })
  }
}

export default RateChefProfileByIdUseCase
