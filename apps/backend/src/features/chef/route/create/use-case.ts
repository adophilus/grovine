import { Result } from 'true-myth'
import { ulid } from 'ulidx'
import type { User } from '@/types'
import type { ChefRepository } from '../../repository'
import type { Request, Response } from './types'

class CreateChefUseCase {
  constructor(private chefRepository: ChefRepository) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const _payload = {
      ...payload,
      is_verified: true,
      is_banned: true,
      rating: 0,
      likes: 0,
      dislikes: 0,
      user_id: user.id,
      id: ulid()
    }
    const createChefResult = await this.chefRepository.create(_payload)

    if (createChefResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'CHEF_PROFILE_CREATED'
    })
  }
}

export default CreateChefUseCase
