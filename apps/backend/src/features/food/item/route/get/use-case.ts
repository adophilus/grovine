import { FoodItemRepository } from '../../repository'
import type { Response } from './types'
import { Result } from 'true-myth'
import { serializeItem } from '../../utils'

class GetFoodItemUseCase {
  constructor(private foodItemRepository: FoodItemRepository) {}

  async execute(id: string): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.foodItemRepository.findById(id)

    if (result.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }
    if (result.value === null) {
      return Result.err({ code: 'ERR_ITEM_NOT_FOUND' })
    }

    const item = result.value
    return Result.ok({
      code: 'ITEM_FOUND',
      data: serializeItem(item)
    })
  }
}

export default GetFoodItemUseCase
