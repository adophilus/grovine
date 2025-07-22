import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ChefRepository } from '../../repository'
import type { User } from '@/types'
import { ulid } from 'ulidx'

class CreateChefUseCase {
  constructor(private chefRepository: ChefRepository) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const createChefResult = await this.chefRepository.create({
      ...payload,
      user_id: user.id,
      is_verified: true,
      is_banned: true,
      rating: 0,
      id: ulid()
    })

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
