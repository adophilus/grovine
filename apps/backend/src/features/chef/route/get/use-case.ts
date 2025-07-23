import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ChefRepository } from '../../repository'

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

    return Result.ok({
      code: 'CHEF_PROFILE_FOUND',
      data: chef
    })
  }
}

export default GetChefUseCase
