import { FoodItemRepository } from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { serializeItem } from '../../utils'
import { Pagination } from '@/features/pagination'

class ListFoodItemsUseCase {
  constructor(private foodItemRepository: FoodItemRepository) {}

  async execute(
    query: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const listItemsResult = await this.foodItemRepository.findMany(query)

    if (listItemsResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const paginatedItems = listItemsResult.value
    const serializedItems = paginatedItems.data.map(serializeItem)

    return Result.ok({
      code: 'LIST',
      data: Pagination.paginate(serializedItems, paginatedItems.meta)
    })
  }
}

export default ListFoodItemsUseCase
