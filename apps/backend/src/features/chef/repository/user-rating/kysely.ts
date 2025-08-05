import type { KyselyClient } from '@/features/database/kysely'
import type ChefUserRatingRepository from './interface'
import type { ChefRepositoryError } from './interface'
import { Result, type Unit } from 'true-myth'
import type { ChefUserRating } from '@/types'
import type { Logger } from '@/features/logger'
import { Pagination } from '@/features/pagination'

class KyselyChefUserRatingRepository implements ChefUserRatingRepository {
  constructor(
    private readonly db: KyselyClient,
    private readonly logger: Logger
  ) {}

  public async create(
    payload: ChefUserRating.Insertable
  ): Promise<Result<ChefUserRating.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.db
        .insertInto('chef_user_ratings')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error creating chef user rating', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findById(
    id: string
  ): Promise<Result<ChefUserRating.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('chef_user_ratings')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error finding chef user rating by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findByChefIdAndUserId(
    chefId: string,
    userId: string
  ): Promise<Result<ChefUserRating.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('chef_user_ratings')
        .selectAll()
        .where('chef_id', '=', chefId)
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error(
        'Error finding chef user rating by chefId and userId',
        error
      )
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findManyByUserId(
    userId: string,
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<ChefUserRating.Selectable>, ChefRepositoryError>
  > {
    try {
      const query = this.db
        .selectFrom('chef_user_ratings')
        .selectAll()
        .where('user_id', '=', userId)
        .limit(options.per_page)
        .offset((options.page - 1) * options.per_page)

      const items = await query.execute()

      const { count } = await this.db
        .selectFrom('chef_user_ratings')
        .select((qb) => qb.fn.count('id').as('count'))
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()

      const paginatedItems = Pagination.paginate(items, {
        ...options,
        total: Number(count)
      })

      return Result.ok(paginatedItems)
    } catch (error) {
      this.logger.error('Error finding many chef user ratings by userId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async updateById(
    id: string,
    payload: ChefUserRating.Updateable
  ): Promise<Result<ChefUserRating.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.db
        .updateTable('chef_user_ratings')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error updating chef user rating by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async deleteById(
    id: string
  ): Promise<Result<Unit, ChefRepositoryError>> {
    try {
      await this.db
        .deleteFrom('chef_user_ratings')
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return Result.ok()
    } catch (error) {
      this.logger.error('Error deleting chef user rating by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async rateById(
    chefId: string,
    userId: string,
    rating: number
  ): Promise<Result<Unit, ChefRepositoryError>> {
    try {
      const existingRating = await this.db
        .selectFrom('chef_user_ratings')
        .selectAll()
        .where('chef_id', '=', chefId)
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (existingRating) {
        await this.db
          .updateTable('chef_user_ratings')
          .set({ rating: rating })
          .where('id', '=', existingRating.id)
          .execute()
      } else {
        await this.db
          .insertInto('chef_user_ratings')
          .values({ chef_id: chefId, user_id: userId, rating: rating })
          .execute()
      }

      return Result.ok()
    } catch (error) {
      this.logger.error('Error rating chef', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyChefUserRatingRepository
