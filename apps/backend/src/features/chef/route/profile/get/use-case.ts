import { Result } from 'true-myth'
import { serializeChef } from '@/features/chef/utils'
import type { User } from '@/types'
import type { ChefRepository } from '../../../repository'
import type { Response } from './types'

class GetActiveChefProfileUseCase {
  constructor(private chefRepository: ChefRepository) {}

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

    const serializedChef = serializeChef(chef)

    return Result.ok({
      code: 'CHEF_PROFILE_FOUND',
      data: serializedChef
    })
  }
}

export default GetActiveChefProfileUseCase
