import { KyselyClient } from '@/features/database/kysely'
import type RecipeUserLikeRepository from './interface'
import type { RecipeRepositoryError } from './interface'
import { Result, type Unit } from 'true-myth'
import type { RecipeUserLike } from '@/types'
import type { Logger } from '@/features/logger'
import { Pagination } from '@/features/pagination'
import { ulid } from 'ulidx'

class KyselyRecipeUserLikeRepository implements RecipeUserLikeRepository {
  constructor(
    private readonly db: KyselyClient,
    private readonly logger: Logger
  ) {}

  public async create(
    payload: RecipeUserLike.Insertable
  ): Promise<Result<RecipeUserLike.Selectable, RecipeRepositoryError>> {
    try {
      const result = await this.db
        .insertInto('recipe_user_likes')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error creating recipe user like', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findById(
    id: string
  ): Promise<Result<RecipeUserLike.Selectable, RecipeRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('recipe_user_likes')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error finding recipe user like by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findByRecipeIdAndUserId(
    recipeId: string,
    userId: string
  ): Promise<Result<RecipeUserLike.Selectable, RecipeRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('recipe_user_likes')
        .selectAll()
        .where('recipe_id', '=', recipeId)
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error(
        'Error finding recipe user like by recipeId and userId',
        error
      )
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findManyByUserId(
    userId: string,
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<RecipeUserLike.Selectable>, RecipeRepositoryError>
  > {
    try {
      const query = this.db
        .selectFrom('recipe_user_likes')
        .selectAll()
        .where('user_id', '=', userId)
        .limit(options.per_page)
        .offset((options.page - 1) * options.per_page)

      const items = await query.execute()

      const { count } = await this.db
        .selectFrom('recipe_user_likes')
        .select((qb) => qb.fn.count('id').as('count'))
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()

      const paginatedItems = Pagination.paginate(items, {
        ...options,
        total: Number(count)
      })

      return Result.ok(paginatedItems)
    } catch (error) {
      this.logger.error('Error finding many recipe user likes by userId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async updateById(
    id: string,
    payload: RecipeUserLike.Updateable
  ): Promise<Result<RecipeUserLike.Selectable, RecipeRepositoryError>> {
    try {
      const result = await this.db
        .updateTable('recipe_user_likes')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error updating recipe user like by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async deleteById(
    id: string
  ): Promise<Result<Unit, RecipeRepositoryError>> {
    try {
      await this.db
        .deleteFrom('recipe_user_likes')
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return Result.ok()
    } catch (error) {
      this.logger.error('Error deleting recipe user like by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async toggleLikeById(
    recipeId: string,
    userId: string
  ): Promise<Result<Unit, RecipeRepositoryError>> {
    try {
      const existingLike = await this.db
        .selectFrom('recipe_user_likes')
        .selectAll()
        .where('recipe_id', '=', recipeId)
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (existingLike) {
        await this.db
          .updateTable('recipe_user_likes')
          .set({ is_liked: !existingLike.is_liked, is_disliked: false })
          .where('id', '=', existingLike.id)
          .execute()
      } else {
        await this.db
          .insertInto('recipe_user_likes')
          .values({ id: ulid(), recipe_id: recipeId, user_id: userId, is_liked: true, is_disliked: false })
          .execute()
      }

      return Result.ok()
    } catch (error) {
      this.logger.error('Error toggling recipe user like', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async toggleDislikeById(
    recipeId: string,
    userId: string
  ): Promise<Result<Unit, RecipeRepositoryError>> {
    try {
      const existingLike = await this.db
        .selectFrom('recipe_user_likes')
        .selectAll()
        .where('recipe_id', '=', recipeId)
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (existingLike) {
        await this.db
          .updateTable('recipe_user_likes')
          .set({ is_disliked: !existingLike.is_disliked, is_liked: false })
          .where('id', '=', existingLike.id)
          .execute()
      } else {
        await this.db
          .insertInto('recipe_user_likes')
          .values({ id: ulid(), recipe_id: recipeId, user_id: userId, is_disliked: true, is_liked: false })
          .execute()
      }

      return Result.ok()
    } catch (error) {
      this.logger.error('Error toggling recipe user dislike', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async countLikesByRecipeId(
    recipeId: string
  ): Promise<Result<number, RecipeRepositoryError>> {
    try {
      const { count } = await this.db
        .selectFrom('recipe_user_likes')
        .select((qb) => qb.fn.count('id').as('count'))
        .where('recipe_id', '=', recipeId)
        .where('is_liked', '=', true)
        .executeTakeFirstOrThrow()

      return Result.ok(Number(count))
    } catch (error) {
      this.logger.error('Error counting likes by recipeId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async countDislikesByRecipeId(
    recipeId: string
  ): Promise<Result<number, RecipeRepositoryError>> {
    try {
      const { count } = await this.db
        .selectFrom('recipe_user_likes')
        .select((qb) => qb.fn.count('id').as('count'))
        .where('recipe_id', '=', recipeId)
        .where('is_disliked', '=', true)
        .executeTakeFirstOrThrow()

      return Result.ok(Number(count))
    } catch (error) {
      this.logger.error('Error counting dislikes by recipeId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyRecipeUserLikeRepository
