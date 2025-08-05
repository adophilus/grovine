
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ChefRepository } from '../../../repository'
import type { ChefUserLikeRepository } from '../../../repository/user-like'
import type { User } from '@/types'

class DislikeChefProfileByIdUseCase {
  constructor(
    private chefRepository: ChefRepository,
    private chefUserLikeRepository: ChefUserLikeRepository
  ) {}

  async execute(
    payload: Request.Path,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const findChefProfile = await this.chefRepository.findById(payload.id)

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

    const dislikeChefResult = await this.chefUserLikeRepository.toggleDislikeById(
      chefProfile.id,
      user.id
    )

    if (dislikeChefResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'CHEF_PROFILE_DISLIKED'
    })
  }
}

export default DislikeChefProfileByIdUseCase
