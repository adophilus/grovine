import { db } from '@/features/database'
import type { Order, OrderItem } from '@/types'
import { Result, type Unit } from 'true-myth'
import { logger } from './logger'
import type { Pagination } from '@/features/pagination'

namespace Repository {
  export type Error = 'ERR_UNEXPECTED'

  export type OrderWithItems = Order.Selectable & {
    items: OrderItem.Selectable[]
  }

  export const findOrderById = async (
    id: string
  ): Promise<Result<OrderWithItems | null, Error>> => {
    try {
      const order = await db
        .selectFrom('orders')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()

      if (!order) {
        return Result.ok(null)
      }

      const items = await db
        .selectFrom('order_items')
        .selectAll()
        .where('order_id', '=', order.id)
        .execute()

      return Result.ok({
        ...order,
        items
      })
    } catch (err) {
      logger.error('failed to find order by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const findOrdersByUserId = async (
    userId: string,
    options: Pagination.Options
  ): Promise<Result<OrderWithItems[], Error>> => {
    try {
      const orders = await db
        .selectFrom('orders')
        .selectAll()
        .where('user_id', '=', userId)
        .offset((options.page - 1) * options.per_page)
        .limit(options.per_page)
        .execute()

      const promises = orders.map(async (order) => {
        const items = await db
          .selectFrom('order_items')
          .selectAll()
          .where('order_id', '=', order.id)
          .execute()

        return {
          ...order,
          items
        }
      })

      const resolved = await Promise.all(promises)

      return Result.ok(resolved)
    } catch (err) {
      logger.error('failed to find orders by user id:', userId, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const updateOrderStatusById = async (
    id: string,
    status: Order.Selectable['status']
  ): Promise<Result<Order.Selectable | null, Error>> => {
    try {
      const order = await db
        .updateTable('orders')
        .set({
          status
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst()

      return Result.ok(order ?? null)
    } catch (err) {
      logger.error('failed to update order status by id:', status, id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default Repository
