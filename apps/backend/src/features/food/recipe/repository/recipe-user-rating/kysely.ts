import { Result, type Unit } from 'true-myth'
import { ulid } from 'ulidx'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import { Pagination } from '@/features/pagination'
import type { RecipeUserRating } from '@/types'
import type RecipeUserRatingRepository from './interface'
import type { RecipeRepositoryError } from './interface'

class KyselyRecipeUserRatingRepository implements RecipeUserRatingRepository {
  constructor(
    private readonly db: KyselyClient,
    private readonly logger: Logger
  ) {}

  public async create(
    payload: RecipeUserRating.Insertable
  ): Promise<Result<RecipeUserRating.Selectable, RecipeRepositoryError>> {
    try {
      const result = await this.db
        .insertInto('recipe_user_ratings')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error creating recipe user rating', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findById(
    id: string
  ): Promise<Result<RecipeUserRating.Selectable, RecipeRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('recipe_user_ratings')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error finding recipe user rating by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findByRecipeIdAndUserId(
    recipeId: string,
    userId: string
  ): Promise<Result<RecipeUserRating.Selectable, RecipeRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('recipe_user_ratings')
        .selectAll()
        .where('recipe_id', '=', recipeId)
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error(
        'Error finding recipe user rating by recipeId and userId',
        error
      )
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findManyByUserId(
    userId: string,
    options: Pagination.Options
  ): Promise<
    Result<
      Pagination.Paginated<RecipeUserRating.Selectable>,
      RecipeRepositoryError
    >
  > {
    try {
      const query = this.db
        .selectFrom('recipe_user_ratings')
        .selectAll()
        .where('user_id', '=', userId)
        .limit(options.per_page)
        .offset((options.page - 1) * options.per_page)

      const items = await query.execute()

      const { count } = await this.db
        .selectFrom('recipe_user_ratings')
        .select((qb) => qb.fn.count('id').as('count'))
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()

      const paginatedItems = Pagination.paginate(items, {
        ...options,
        total: Number(count)
      })

      return Result.ok(paginatedItems)
    } catch (error) {
      this.logger.error(
        'Error finding many recipe user ratings by userId',
        error
      )
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async updateById(
    id: string,
    payload: RecipeUserRating.Updateable
  ): Promise<Result<RecipeUserRating.Selectable, RecipeRepositoryError>> {
    try {
      const result = await this.db
        .updateTable('recipe_user_ratings')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error updating recipe user rating by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async deleteById(
    id: string
  ): Promise<Result<Unit, RecipeRepositoryError>> {
    try {
      await this.db
        .deleteFrom('recipe_user_ratings')
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return Result.ok()
    } catch (error) {
      this.logger.error('Error deleting recipe user rating by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async rateById(
    recipeId: string,
    userId: string,
    rating: number
  ): Promise<Result<Unit, RecipeRepositoryError>> {
    try {
      const existingRating = await this.db
        .selectFrom('recipe_user_ratings')
        .selectAll()
        .where('recipe_id', '=', recipeId)
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (existingRating) {
        await this.db
          .updateTable('recipe_user_ratings')
          .set({ rating: rating })
          .where('id', '=', existingRating.id)
          .execute()
      } else {
        await this.db
          .insertInto('recipe_user_ratings')
          .values({
            id: ulid(),
            recipe_id: recipeId,
            user_id: userId,
            rating: rating
          })
          .execute()
      }

      return Result.ok()
    } catch (error) {
      this.logger.error('Error rating recipe', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async getAverageRatingByRecipeId(
    recipeId: string
  ): Promise<Result<number, RecipeRepositoryError>> {
    try {
      const { avg } = await this.db
        .selectFrom('recipe_user_ratings')
        .select((qb) => qb.fn.avg('rating').as('avg'))
        .where('recipe_id', '=', recipeId)
        .executeTakeFirstOrThrow()

      return Result.ok(Number(avg))
    } catch (error) {
      this.logger.error('Error getting average rating by recipeId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async countRatingsByRecipeId(
    recipeId: string
  ): Promise<Result<number, RecipeRepositoryError>> {
    try {
      const { count } = await this.db
        .selectFrom('recipe_user_ratings')
        .select((qb) => qb.fn.count('id').as('count'))
        .where('recipe_id', '=', recipeId)
        .executeTakeFirstOrThrow()

      return Result.ok(Number(count))
    } catch (error) {
      this.logger.error('Error counting ratings by recipeId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyRecipeUserRatingRepository
