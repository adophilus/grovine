import { Result } from 'true-myth'
import { Pagination } from '@/features/pagination'
import type { FoodItemRepository } from '../../repository'
import { serializeItem } from '../../utils'
import type { Request, Response } from './types'

class ListFoodItemsUseCase {
  constructor(private foodItemRepository: FoodItemRepository) {}

  async execute(
    query: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const listItemsResult = await this.foodItemRepository.findMany({
      ...query,
      is_deleted: false
    })

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
