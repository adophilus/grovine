import { Result, type Unit } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely/interface'
import type { Logger } from '@/features/logger'
import { Pagination } from '@/features/pagination'
import type { Notifications } from '@/types'
import type NotificationsRepository from './interface'
import type { NotificationsRepositoryError } from './interface'

class KyselyNotificationsRepository implements NotificationsRepository {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  async create(
    payload: Notifications.Insertable
  ): Promise<Result<Notifications.Selectable, NotificationsRepositoryError>> {
    try {
      const notification = await this.client
        .insertInto('notifications')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(notification)
    } catch (err) {
      this.logger.error('failed to create notification', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findById(
    id: string
  ): Promise<Result<Notifications.Selectable | null, NotificationsRepositoryError>> {
    try {
      const notification = await this.client
        .selectFrom('notifications')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(notification ?? null)
    } catch (err) {
      this.logger.error('failed to get notification by id', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async deleteById(id: string): Promise<Result<Unit, NotificationsRepositoryError>> {
    try {
      await this.client
        .updateTable('notifications')
        .set({
          deleted_at: new Date().toISOString(),
        })
        .where('id', '=', id)
        .execute()
      return Result.ok()
    } catch (err) {
      this.logger.error('failed to delete the specified notification: ', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async list(
    payload: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<Notifications.Selectable>, NotificationsRepositoryError>
  > {
    try {
      const notifications = await this.client
        .selectFrom('notifications')
        .selectAll()
        .where('deleted_at', 'is', null)
        .orderBy('date', 'desc')
        .limit(payload.per_page)
        .offset((payload.page - 1) * payload.per_page)
        .execute()

      const { total } = await this.client
        .selectFrom('notifications')
        .select((eb) => eb.fn.countAll().as('total'))
        .where('deleted_at', 'is', null)
        .executeTakeFirstOrThrow()

      const paginatedNotifications = Pagination.paginate(notifications, {
        ...payload,
        total: Number(total)
      })

      return Result.ok(paginatedNotifications)
    } catch (err) {
      this.logger.error('failed to list notifications:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async getCount(): Promise<Result<number, NotificationsRepositoryError>> {
    try {
      const { total } = await this.client
        .selectFrom('notifications')
        .select((eb) => eb.fn.countAll().as('total'))
        .where('deleted_at', 'is', null)
        .executeTakeFirstOrThrow()

      return Result.ok(Number(total))
    } catch (err) {
      this.logger.error('failed to count notifications:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyNotificationsRepository
