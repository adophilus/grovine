import type { Result } from 'true-myth'
import type { Pagination } from '@/features/pagination'
import type { Order, OrderItem } from '@/types'

export type OrderRepositoryError = 'ERR_UNEXPECTED'

export type OrderWithItems = Order.Selectable & {
  items: OrderItem.Selectable[]
}

abstract class OrderRepository {
  public abstract createFromCart(
    cartId: string,
    payload: Order.Insertable
  ): Promise<Result<Order.Selectable, OrderRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<OrderWithItems | null, OrderRepositoryError>>

  public abstract findManyByUserId(
    userId: string,
    options: Pagination.Options
  ): Promise<Result<Pagination.Paginated<OrderWithItems>, OrderRepositoryError>>

  public abstract updateStatusById(
    id: string,
    status: Order.Selectable['status']
  ): Promise<Result<Order.Selectable | null, OrderRepositoryError>>
}

export default OrderRepository
