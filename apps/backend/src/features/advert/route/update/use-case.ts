import type { Request, Response } from './types'
import { Result } from 'true-myth'
import type { StorageService, UploadedData } from '@/features/storage/service'
import type { AdvertRepository } from '../../repository'
import { Service } from '@n8n/di'

@Service()
class UpdateAdvertUseCase {
  constructor(
    private advertRepository: AdvertRepository,
    private storage: StorageService
  ) {}

  async execute(
    id: string,
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const findAdvertResult = await this.advertRepository.findById(id)

    if (findAdvertResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    if (!findAdvertResult.value) {
      return Result.err({ code: 'ERR_ADVERTISEMENT_NOT_FOUND' })
    }

    const { image, title, description, target_url, is_active, priority, ..._payload } = payload

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

    const updatePayload: Record<string, any> = {
      ..._payload
    }

    if (updatedImage) {
      updatePayload.media = updatedImage
    }
    
    if (title !== undefined) {
      updatePayload.title = title
    }
    
    if (description !== undefined) {
      updatePayload.description = description
    }
    
    if (target_url !== undefined) {
      updatePayload.target_url = target_url
    }
    
    if (is_active !== undefined) {
      updatePayload.is_active = is_active
    }
    
    if (priority !== undefined) {
      updatePayload.priority = priority
    }

    const updateAdvertResult = await this.advertRepository.updateById(
      id,
      updatePayload
    )

    if (updateAdvertResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    return Result.ok({
      code: 'ADVERTISEMENT_UPDATED'
    })
  }
}

export default UpdateAdvertUseCase
