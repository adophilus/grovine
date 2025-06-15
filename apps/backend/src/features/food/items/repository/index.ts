import { db } from '@/features/database'
import type { FoodItem } from '@/types'
import { Result } from 'true-myth'
import { logger } from './logger'
import type { Pagination } from '@/features/pagination'

namespace Repository {
  export type Error = 'ERR_UNEXPECTED'

  export type CreateItemPayload = FoodItem.Insertable

  export const createItem = async (
    payload: CreateItemPayload
  ): Promise<Result<FoodItem.Selectable, Error>> => {
    try {
      const item = await db
        .insertInto('food_items')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(item)
    } catch (err) {
      logger.error('failed to create item:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type ListItemsPayload = Pagination.Options
  export const listItems = async (
    payload: ListItemsPayload
  ): Promise<Result<FoodItem.Selectable[], Error>> => {
    try {
      const items = await db
        .selectFrom('food_items')
        .selectAll()
        .limit(payload.per_page)
        .offset(payload.page)
        .execute()

      return Result.ok(items)
    } catch (err) {
      logger.error('failed to list items:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type FindItemByIdPayload = {
    id: string
  }
  export const findItemById = async (
    payload: FindItemByIdPayload
  ): Promise<Result<FoodItem.Selectable | null, Error>> => {
    try {
      const item = await db
        .selectFrom('food_items')
        .selectAll()
        .where('id', '=', payload.id)
        .executeTakeFirst()
      return Result.ok(item ?? null)
    } catch (err) {
      logger.error('failed to find item by id:', payload.id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type UpdateItemByIdPayload = Partial<FoodItem.Updateable>
  export const updateItemById = async (
    id: string,
    payload: UpdateItemByIdPayload
  ): Promise<Result<FoodItem.Selectable, Error>> => {
    try {
      const item = await db
        .updateTable('food_items')
        .set({
          ...payload,
          updated_at: new Date().toISOString()
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(item)
    } catch (err) {
      logger.error('failed to update item by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type DeleteItemByIdPayload = {
    id: string
  }
  export const deleteItemById = async (
    payload: DeleteItemByIdPayload
  ): Promise<Result<void, Error>> => {
    try {
      await db.deleteFrom('food_items').where('id', '=', payload.id).execute()
      return Result.ok(undefined)
    } catch (err) {
      logger.error('failed to delete item by id:', payload.id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default Repository
