import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import { Pagination } from '@/features/pagination'
import type { FoodItem } from '@/types'

export interface SearchOptions extends Pagination.Schema {
  q?: string
  is_deleted?: boolean
}

class KyselyFoodSearchRepository {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  public async searchFoodItems(
    options: SearchOptions
  ): Promise<
    Result<Pagination.Paginated<FoodItem.Selectable>, 'ERR_UNEXPECTED'>
  > {
    try {
      let query = this.client
        .selectFrom('food_items')
        .selectAll()
        .limit(options.per_page)
        .offset((options.page - 1) * options.per_page)

      if (options.q) {
        query = query.where('name', 'ilike', `%${options.q}%`)
      }

      if (options.is_deleted !== undefined) {
        if (options.is_deleted) {
          query = query.where('deleted_at', 'is not', null)
        } else {
          query = query.where('deleted_at', 'is', null)
        }
      }

      console.log(query.compile().sql)
      const items = await query.execute()

      const totalResult = await this.client
        .selectFrom('food_items')
        .select((eb) => eb.fn.count('id').as('total'))
        .where((eb) => {
          let cond = eb('id', 'is not', null)
          if (options.q)
            cond = eb.and([cond, eb('name', 'ilike', `%${options.q}%`)])
          if (options.is_deleted !== undefined) {
            cond = eb.and([
              cond,
              options.is_deleted
                ? eb('deleted_at', 'is not', null)
                : eb('deleted_at', 'is', null)
            ])
          }
          return cond
        })
        .executeTakeFirstOrThrow()

      const total = Number(totalResult.total)

      const paginated = Pagination.paginate(items, {
        ...options,
        total
      })

      return Result.ok(paginated)
    } catch (err) {
      this.logger.error('failed to search food items:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyFoodSearchRepository
