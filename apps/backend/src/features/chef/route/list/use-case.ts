import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { ChefRepository } from '../../repository'
import { serializeChef } from '../../utils'
import { Pagination } from '@/features/pagination'

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

    const paginatedChefs = findChefsResult.value
    const chefs = paginatedChefs.data
    const serializedChefs = chefs.map(serializeChef)

    const returnData = Pagination.paginate(serializedChefs, paginatedChefs.meta)

    return Result.ok({
      code: 'LIST',
      data: returnData
    })
  }
}

export default ListChefUseCase
