import { db } from '@/features/database'
import type { Cart, CartItem, Order } from '@/types'
import { Result, type Unit } from 'true-myth'
import { logger } from './logger'
import { ulid } from 'ulidx'
import ItemsRepository from '@/features/food/items/repository'
import { sql } from 'kysely'

namespace Repository {
  export type Error = 'ERR_UNEXPECTED'

  export type CartWithGroupedItems = Cart.Selectable & {
    items: {
      image: CartItem.Selectable['image']
      items: CartItem.Selectable[]
      total_price: number
    }[]
  }

  export const findCartByUserId = async (
    userId: string
  ): Promise<Result<CartWithGroupedItems | null, Error>> => {
    try {
      const cart = await db
        .selectFrom('carts')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (!cart) {
        return Result.ok(null)
      }

      const items = await db
        .selectFrom('cart_items')
        .selectAll()
        .where('cart_id', '=', cart.id)
        .execute()

      // Group items by image
      const groupedItems = items.reduce(
        (acc, item) => {
          const key = item.image.public_id
          if (!acc[key]) {
            acc[key] = {
              image: item.image,
              items: [],
              total_price: 0
            }
          }
          acc[key].items.push(item)
          acc[key].total_price += Number(item.price) * item.quantity
          return acc
        },
        {} as Record<
          string,
          {
            image: CartItem.Selectable['image']
            items: CartItem.Selectable[]
            total_price: number
          }
        >
      )

      return Result.ok({
        ...cart,
        items: Object.values(groupedItems)
      })
    } catch (err) {
      logger.error('failed to list cart:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const addItemToCart = async (
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<Result<Unit, 'ERR_UNEXPECTED' | 'ERR_ITEM_NOT_FOUND'>> => {
    try {
      // Get or create cart
      let cart = await db
        .selectFrom('carts')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (!cart) {
        cart = await db
          .with('_food_item', (qb) =>
            qb.selectFrom('food_items').selectAll().where('id', '=', itemId)
          )
          .insertInto('carts')
          .values({
            id: ulid(),
            price: sql`_food_item.price`,
            user_id: userId
          })
          .returningAll()
          .executeTakeFirstOrThrow()
      }

      // Get item details
      const itemResult = await ItemsRepository.findItemById(itemId)
      if (itemResult.isErr) {
        return Result.err('ERR_UNEXPECTED')
      }

      const item = itemResult.value
      if (!item) {
        return Result.err('ERR_ITEM_NOT_FOUND')
      }

      // Add item to cart
      await db
        .insertInto('cart_items')
        .values({
          id: ulid(),
          cart_id: cart.id,
          image: item.image,
          quantity,
          price: item.price
        })
        .execute()

      return Result.ok()
    } catch (err) {
      logger.error('failed to add item to cart:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type CreateOrderFromCartPayload = Order.Insertable & {
    cart_id: string
  }

  export const createOrderFromCart = async (
    payload: CreateOrderFromCartPayload
  ): Promise<Result<Order.Selectable, Error>> => {
    try {
      const order = await db
        .insertInto('orders')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      await db
        .with('_cart_items', (qb) =>
          qb
            .selectFrom('cart_items')
            .selectAll()
            .where('cart_id', '=', payload.cart_id)
        )
        .insertInto('order_items')
        .expression((qb) =>
          qb
            .selectFrom('_cart_items')
            .select([
              '_cart_items.id',
              '_cart_items.image',
              '_cart_items.quantity',
              '_cart_items.price',
              qb.val(order.id).as('order_id')
            ])
        )
        .execute()

      return Result.ok(order)
    } catch (err) {
      logger.error('failed to create order from cart:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const clearCartById = async (
    id: string
  ): Promise<Result<Unit, Error>> => {
    try {
      await db.deleteFrom('cart_items').where('cart_id', '=', id).execute()
      return Result.ok()
    } catch (err) {
      logger.error('failed to clear cart:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default Repository
