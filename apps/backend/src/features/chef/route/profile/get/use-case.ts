import type { Response } from './types'
import { Result } from 'true-myth'
import type { ChefRepository } from '../../../repository'
import type { User } from '@/types'
import type { Logger } from '@/features/logger'

class GetActiveChefProfileUseCase {
  constructor(
    private chefRepository: ChefRepository,
    private logger: Logger
  ) {}

  async execute(
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const findChefResult = await this.chefRepository.findByUserId(user.id)

    if (findChefResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const chef = findChefResult.value
    if (!chef) {
      return Result.err({
        code: 'ERR_CHEF_PROFILE_NOT_FOUND'
      })
    }

    return Result.ok({
      code: 'CHEF_PROFILE_FOUND',
      data: chef
    })
  }
}

export default GetActiveChefProfileUseCase
