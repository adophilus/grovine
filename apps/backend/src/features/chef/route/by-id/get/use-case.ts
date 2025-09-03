import { Result } from 'true-myth'
import { serializeChef } from '@/features/chef/utils'
import type { ChefRepository } from '../../../repository'
import type { Request, Response } from './types'

class GetChefUseCase {
  constructor(private chefRepository: ChefRepository) {}

  async execute(
    payload: Request.Path
  ): Promise<Result<Response.Success, Response.Error>> {
    const findChefResult = await this.chefRepository.findById(payload.id)

    if (findChefResult.isErr) {
      return Result.err({
        code: 'ERR_CHEF_PROFILE_NOT_FOUND'
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

export default GetChefUseCase
