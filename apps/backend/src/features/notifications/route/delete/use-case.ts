import { Result } from 'true-myth'
import type { NotificationsRepository } from '../../repository'
import type { Request, Response } from './types'

class DeleteNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(
    payload: Request.Path
  ): Promise<Result<Response.Success, Response.Error>> {
    const deleteResult = await this.notificationRepository.deleteById(payload.id)

    if (deleteResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    return Result.ok({
      code: 'NOTIFICATION_DELETED'
    })
  }
}

export default DeleteNotificationUseCase