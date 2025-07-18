import { FoodItemRepository } from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { serializeItem } from '../../utils'

class ListFoodItemsUseCase {
  constructor(private foodItemRepository: FoodItemRepository) {}

  async execute(
    query: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const listItemsResult = await this.foodItemRepository.list(query)

    if (listItemsResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const items = listItemsResult.value

    return Result.ok({
      code: 'LIST',
      data: items.map(serializeItem),
      meta: {
        page: query.page,
        per_page: query.per_page,
        total: items.length
      }
    })
  }
}

export default ListFoodItemsUseCase
