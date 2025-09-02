import { ulid } from 'ulidx'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { StorageService } from '@/features/storage/service'
import { serializeItem } from '../../utils'
import type { FoodItemRepository } from '../../repository'
import type { User } from '@/types'

class CreateFoodItemUseCase {
  constructor(
    private foodItemRepository: FoodItemRepository,
    private storage: StorageService
  ) {}

  async execute(
    payload: Request.Body,
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    if (user.role !== 'ADMIN') {
      return Result.err({
        code: 'ERR_UNAUTHORIZED'
      })
    }

    const { image, ..._payload } = payload

    const uploadImageResult = await this.storage.upload(image)

    if (uploadImageResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const uploadedImage = uploadImageResult.value

    const createItemResult = await this.foodItemRepository.create({
      ..._payload,
      price: _payload.price.toString(),
      image: uploadedImage,
      id: ulid()
    })

    if (createItemResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'ITEM_CREATED',
      data: serializeItem(createItemResult.value)
    })
  }
}

export default CreateFoodItemUseCase
