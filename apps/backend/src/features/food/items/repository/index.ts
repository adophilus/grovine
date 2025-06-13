import { db } from '@/features/database'
import type { Item } from '@/types'
import { Result } from 'true-myth'
import { logger } from './logger'
import type { Pagination } from '@/features/pagination'

namespace Repository {
  export type Error = 'ERR_UNEXPECTED'

  export type CreateItemPayload = Item.Insertable

  export const createItem = async (
    payload: CreateItemPayload
  ): Promise<Result<Item.Selectable, Error>> => {
    try {
      const item = await db
        .insertInto('items')
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
  ): Promise<Result<Item.Selectable[], Error>> => {
    try {
      const items = await db
        .selectFrom('items')
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
  ): Promise<Result<Item.Selectable | null, Error>> => {
    try {
      const item = await db
        .selectFrom('items')
        .selectAll()
        .where('id', '=', payload.id)
        .executeTakeFirst()
      return Result.ok(item ?? null)
    } catch (err) {
      logger.error('failed to find item by id:', payload.id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type UpdateItemByIdPayload = Partial<Item.Updateable>
  export const updateItemById = async (
    id: string,
    payload: UpdateItemByIdPayload
  ): Promise<Result<Item.Selectable, Error>> => {
    try {
      const item = await db
        .updateTable('items')
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
      await db.deleteFrom('items').where('id', '=', payload.id).execute()
      return Result.ok(undefined)
    } catch (err) {
      logger.error('failed to delete item by id:', payload.id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default Repository
