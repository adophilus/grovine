import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ChefRepository } from '../../../repository'
import type { ChefUserRatingRepository } from '../../../repository/user-rating'
import type { User } from '@/types'

class RateChefProfileByIdUseCase {
  constructor(
    private chefRepository: ChefRepository,
    private chefUserRatingRepository: ChefUserRatingRepository
  ) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable,
    path: Request.Path
  ): Promise<Result<Response.Success, Response.Error>> {
    const findChefProfile = await this.chefRepository.findById(path.id)

    if (findChefProfile.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const chefProfile = findChefProfile.value
    if (!chefProfile) {
      return Result.err({
        code: 'ERR_CHEF_PROFILE_NOT_FOUND'
      })
    }

    const rateChefResult = await this.chefUserRatingRepository.rateById(
      chefProfile.id,
      user.id,
      payload.rating
    )

    if (rateChefResult.isErr) {
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
