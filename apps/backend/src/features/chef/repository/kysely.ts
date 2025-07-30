import type ChefRepository from './interface'
import type { ChefRepositoryError } from './interface'
import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Chef } from '@/types'
import type { Logger } from '@/features/logger'
import { Pagination } from '@/features/pagination'

class KyselyChefRepository implements ChefRepository {
  constructor(
    private readonly client: KyselyClient,
    private readonly logger: Logger
  ) {}

  async create(
    payload: Chef.Insertable
  ): Promise<Result<Chef.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.client
        .insertInto('chefs')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (err) {
      this.logger.error('failed to create chef', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findById(
    id: string
  ): Promise<Result<Chef.Selectable | null, ChefRepositoryError>> {
    try {
      const result = await this.client
        .selectFrom('chefs')
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst()

      return Result.ok(result ?? null)
    } catch (error) {
      this.logger.error('failed to find chef by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findByUserId(
    user_id: string
  ): Promise<Result<Chef.Selectable | null, ChefRepositoryError>> {
    try {
      const result = await this.client
        .selectFrom('chefs')
        .where('user_id', '=', user_id)
        .selectAll()
        .executeTakeFirst()

      return Result.ok(result ?? null)
    } catch (error) {
      this.logger.error('failed to find chef by user id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findMany(
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<Chef.Selectable>, ChefRepositoryError>
  > {
    try {
      const items = await this.client
        .selectFrom('chefs')
        .limit(options.per_page)
        .offset((options.page - 1) * options.per_page)
        .selectAll()
        .execute()

      const { total } = await this.client
        .selectFrom('chefs')
        .select((eb) => eb.fn.count('id').as('total'))
        .executeTakeFirstOrThrow()

      this.logger.debug(total)

      const paginatedData = Pagination.paginate(items, {
        ...options,
        total: Number(total)
      })

      return Result.ok(paginatedData)
    } catch (error) {
      this.logger.error('failed to find many chefs', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async updateById(
    id: string,
    payload: Chef.Updateable
  ): Promise<Result<Chef.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.client
        .updateTable('chefs')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('failed to update chef by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async deleteById(
    id: string
  ): Promise<Result<Chef.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.client
        .deleteFrom('chefs')
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('failed to delete chef by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyChefRepository
