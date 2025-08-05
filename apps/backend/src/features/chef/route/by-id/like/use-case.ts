import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ChefRepository } from '../../../repository'
import type { ChefUserLikeRepository } from '../../../repository/user-like'
import type { User } from '@/types'

class LikeChefProfileByIdUseCase {
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

    const likeChefResult = await this.chefUserLikeRepository.toggleLikeById(
      chefProfile.id,
      user.id
    )

    if (likeChefResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'CHEF_PROFILE_LIKED'
    })
  }
}

export default LikeChefProfileByIdUseCase
