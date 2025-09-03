import { Result } from 'true-myth'
import type { User } from '@/types'
import type { ChefService } from '../../../service'
import type { Request, Response } from './types'

class LikeChefProfileByIdUseCase {
  constructor(private chefService: ChefService) {}

  async execute(
    payload: Request.Path,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.chefService.handleLikeToggle(payload.id, user.id)

    if (result.isErr) {
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
