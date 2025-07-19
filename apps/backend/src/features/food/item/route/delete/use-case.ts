import type { Response } from './types'
import { Result } from 'true-myth'
import type { FoodItemRepository } from '../../repository'

class DeleteFoodItemUseCase {
  constructor(private foodItemRepository: FoodItemRepository) {}

  async execute(id: string): Promise<Result<Response.Success, Response.Error>> {
    const findItemResult = await this.foodItemRepository.findById(id)

    if (findItemResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    if (!findItemResult.value) {
      return Result.err({ code: 'ERR_ITEM_NOT_FOUND' })
    }

    const result = await this.foodItemRepository.deleteById(id)

    if (result.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    return Result.ok({ code: 'ITEM_DELETED' })
  }
}

export default DeleteFoodItemUseCase
