import { Result } from 'true-myth'
import type { NotificationsRepository } from '../../repository'
import type { Response } from './types'

class GetNotificationCountUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(): Promise<Result<Response.Success, Response.Error>> {
    const countResult = await this.notificationRepository.getCount()

    if (countResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    return Result.ok({
      code: 'COUNT',
      total: countResult.value
    })
  }
}

export default GetNotificationCountUseCase