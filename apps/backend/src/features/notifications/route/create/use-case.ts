import { Result } from 'true-myth'
import { ulid } from 'ulidx'
import type { StorageService } from '@/features/storage/service'
import type { NotificationsRepository } from '../../repository'
import type { Request, Response } from './types'

class CreateNotificationUseCase {
  constructor(
    private notificationRepository: NotificationsRepository,
    private storage: StorageService
  ) {}

  async execute(
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const { image, content, date, count, ..._payload } = payload

    let uploadedImage
    if (image) {
      const uploadImageResult = await this.storage.upload(image)
      if (uploadImageResult.isErr) {
        return Result.err({ code: 'ERR_UNEXPECTED' })
      }
      uploadedImage = uploadImageResult.value
    }

    const createNotificationResult = await this.notificationRepository.create({
      ..._payload,
      id: ulid(),
      date: date ?? new Date().toISOString(),
      content,
      image: uploadedImage,
      deleted_at: null,
    })

    if (createNotificationResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    return Result.ok({
      code: 'NOTIFICATION_CREATED',
    })
  }
}

export default CreateNotificationUseCase
