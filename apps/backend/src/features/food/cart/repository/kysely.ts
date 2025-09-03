import { Result, type Unit } from 'true-myth'
import { ulid } from 'ulidx'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import type { Cart, CartItem } from '@/types'
import type { FoodItemRepository } from '../../item/repository'
import type FoodCartRepository from './interface'
import type { CartWithGroupedItems, FoodCartRepositoryError } from './interface'

class KyselyFoodCartRepository implements FoodCartRepository {
  constructor(
    private client: KyselyClient,
    private foodItemRepository: FoodItemRepository,
    private logger: Logger
  ) {}

  public async findByUserId(
    userId: string
  ): Promise<Result<CartWithGroupedItems | null, FoodCartRepositoryError>> {
    try {
      const cart = await this.client
        .selectFrom('carts')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (!cart) {
        return Result.ok(null)
      }

      const items = await this.client
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
      this.logger.error('failed to list cart:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async addItem(payload: {
    userId: string
    itemId: string
    quantity: number
  }): Promise<
    Result<
      Cart.Selectable,
      'ERR_ITEM_NOT_FOUND' | 'ERR_UNEXPECTED' | 'ERR_ITEM_NOT_FOUND'
    >
  > {
    try {
      let cart = await this.client
        .selectFrom('carts')
        .selectAll()
        .where('user_id', '=', payload.userId)
        .executeTakeFirst()

      if (!cart) {
        cart = await this.client
          .with('_food_item', (qb) =>
            qb
              .selectFrom('food_items')
              .selectAll()
              .where('id', '=', payload.itemId)
          )
          .insertInto('carts')
          .values((qb) => ({
            id: ulid(),
            price: qb.selectFrom('_food_item').select('price'),
            user_id: payload.userId
          }))
          .returningAll()
          .executeTakeFirstOrThrow()
      }

      const itemResult = await this.foodItemRepository.findById(payload.itemId)
      if (itemResult.isErr) {
        return Result.err('ERR_UNEXPECTED')
      }

      const item = itemResult.value
      if (!item) {
        return Result.err('ERR_ITEM_NOT_FOUND')
      }

      await this.client
        .insertInto('cart_items')
        .values({
          id: ulid(),
          cart_id: cart.id,
          food_item_id: payload.itemId,
          image: item.image,
          quantity: payload.quantity,
          price: item.price
        })
        .execute()

      return Result.ok(cart)
    } catch (err) {
      this.logger.error('failed to add item to cart:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async clearById(
    id: string
  ): Promise<Result<Unit, FoodCartRepositoryError>> {
    try {
      await this.client
        .deleteFrom('cart_items')
        .where('cart_id', '=', id)
        .execute()
      return Result.ok()
    } catch (err) {
      this.logger.error('failed to clear cart:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyFoodCartRepository
