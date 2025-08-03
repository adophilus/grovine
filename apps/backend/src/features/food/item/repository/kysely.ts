import type { FoodItem } from '@/types'
import { Result, type Unit } from 'true-myth'
import { Pagination } from '@/features/pagination'
import type FoodItemRepository from './interface'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import type { FindManyOptions, FoodItemRepositoryError } from './interface'

class KyselyFoodItemRepository implements FoodItemRepository {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  public async create(
    payload: FoodItem.Insertable
  ): Promise<Result<FoodItem.Selectable, FoodItemRepositoryError>> {
    try {
      const item = await this.client
        .insertInto('food_items')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(item)
    } catch (err) {
      this.logger.error('failed to create item:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findMany(
    options: FindManyOptions
  ): Promise<
    Result<Pagination.Paginated<FoodItem.Selectable>, FoodItemRepositoryError>
  > {
    try {
      let itemsQuery = this.client
        .selectFrom('food_items')
        .selectAll()
        .limit(options.per_page)
        .offset(options.page)

      if (options.is_deleted !== undefined) {
        if (options.is_deleted) {
          itemsQuery = itemsQuery.where('deleted_at', 'is not', null)
        } else {
          itemsQuery = itemsQuery.where('deleted_at', 'is', null)
        }
      }

      const items = await itemsQuery.execute()

      const { total } = await this.client
        .selectFrom('food_items')
        .select((eb) => eb.fn.count('id').as('total'))
        .executeTakeFirstOrThrow()

      const paginatedItems = Pagination.paginate(items, {
        ...options,
        total: Number(total)
      })

      return Result.ok(paginatedItems)
    } catch (err) {
      this.logger.error('failed to list items:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findById(
    id: string
  ): Promise<Result<FoodItem.Selectable | null, FoodItemRepositoryError>> {
    try {
      const item = await this.client
        .selectFrom('food_items')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(item ?? null)
    } catch (err) {
      this.logger.error('failed to find item by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async updateById(
    id: string,
    payload: FoodItem.Updateable
  ): Promise<Result<FoodItem.Selectable, FoodItemRepositoryError>> {
    try {
      const query = this.client
        .updateTable('food_items')
        .set({
          ...payload,
          updated_at: new Date().toISOString()
        })
        .where('id', '=', id)

      const item = await query.returningAll().executeTakeFirstOrThrow()

      return Result.ok(item)
    } catch (err) {
      this.logger.error('failed to update item by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async deleteById(
    id: string
  ): Promise<Result<Unit, FoodItemRepositoryError>> {
    try {
      await this.client.deleteFrom('food_items').where('id', '=', id).execute()
      return Result.ok()
    } catch (err) {
      this.logger.error('failed to delete item by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyFoodItemRepository
