import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ChefRepository } from '../../repository'

class ListChefUseCase {
  constructor(private chefRepository: ChefRepository) {}

  async execute(
    payload: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const findChefsResult = await this.chefRepository.findMany(payload)

    if (findChefsResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'LIST',
      data: findChefsResult.value
    })
  }
}

export default ListChefUseCase
