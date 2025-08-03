import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { StorageService, UploadedData } from '@/features/storage/service'
import { serializeItem } from '../../utils'
import type { FoodItemRepository } from '../../repository'

class UpdateFoodItemUseCase {
  constructor(
    private foodItemRepository: FoodItemRepository,
    private storage: StorageService
  ) {}

  async execute(
    id: string,
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const findItemResult = await this.foodItemRepository.findById(id)

    if (findItemResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    if (!findItemResult.value) {
      return Result.err({ code: 'ERR_ITEM_NOT_FOUND' })
    }

    if (findItemResult.value.deleted_at !== null) {
      return Result.err({ code: 'ERR_ITEM_NOT_FOUND' })
    }

    const { image, ..._payload } = payload

    let updatedImage: UploadedData | undefined

    if (image) {
      const uploadImageResult = await this.storage.upload(image)

      if (uploadImageResult.isErr) {
        return Result.err({
          code: 'ERR_UNEXPECTED'
        })
      }

      updatedImage = uploadImageResult.value
    }

    const updatePayload = {
      ..._payload,
      image: updatedImage,
      price: _payload.price?.toString()
    }

    const updateItemResult = await this.foodItemRepository.updateById(
      id,
      updatePayload
    )

    if (updateItemResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const updatedItem = updateItemResult.value

    return Result.ok({
      code: 'ITEM_UPDATED',
      data: serializeItem(updatedItem)
    })
  }
}

export default UpdateFoodItemUseCase
