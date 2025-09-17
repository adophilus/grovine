import { Result } from 'true-myth'
import type { NotificationsRepository } from '../../repository'
import type { Request, Response } from './types'

class ListNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(
    query: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const listNotificationsResult = await this.notificationRepository.list(query)

    if (listNotificationsResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const notifications = listNotificationsResult.value

    return Result.ok({
      code: 'LIST',
      data: notifications
    })
  }
}

export default ListNotificationUseCase