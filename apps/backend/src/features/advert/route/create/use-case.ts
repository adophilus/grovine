import { ulid } from 'ulidx'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { AdvertRepository } from '../../repository'
import type { StorageService } from '@/features/storage/service'

class CreateAdvertUseCase {
  constructor(
    private advertRepository: AdvertRepository,
    private storage: StorageService
  ) {}

  async execute(
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const { image, title, description, target_url, is_active, priority, ..._payload } = payload
    const uploadImageResult = await this.storage.upload(image)

    if (uploadImageResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const uploadedImage = uploadImageResult.value
    const createAdvertResult = await this.advertRepository.create({
      ..._payload,
      media: uploadedImage,
      id: ulid(),
      title: title ?? null,
      description: description ?? null,
      target_url: target_url ?? null,
      is_active: is_active ?? true,
      priority: priority ?? 0
    })

    if (createAdvertResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'ADVERTISEMENT_CREATED'
    })
  }
}

export default CreateAdvertUseCase
