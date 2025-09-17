import type { Result, Unit } from "true-myth";
import type { Pagination } from '@/features/pagination'
import type { Notifications } from "@/types";

export type NotificationsRepositoryError = 
| 'ERR_UNEXPECTED'
| 'ERR_NOTIFICATION_NOT_FOUND'

abstract class NotificationsRepository{
    abstract create(
        payload: Notifications.Insertable
    ): Promise<Result<Notifications.Selectable, NotificationsRepositoryError>>

    abstract findById(
        id: string
    ): Promise<Result<Notifications.Selectable | null, NotificationsRepositoryError>>

    abstract list(
        options: Pagination.Options
    ): Promise<Result<Pagination.Paginated<Notifications.Selectable>, NotificationsRepositoryError>>

    abstract deleteById(
        id: string
    ): Promise<Result<Unit, NotificationsRepositoryError>>

    abstract getCount(): Promise<Result<number, NotificationsRepositoryError>>
}

export default NotificationsRepository