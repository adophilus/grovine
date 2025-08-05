import type { KyselyClient } from '@/features/database/kysely'
import type ChefUserLikeRepository from './interface'
import type { ChefRepositoryError } from './interface'
import { Result, type Unit } from 'true-myth'
import type { ChefUserLike } from '@/types'
import type { Logger } from '@/features/logger'
import { Pagination } from '@/features/pagination'
import { ulid } from 'ulidx'

class KyselyChefUserLikeRepository implements ChefUserLikeRepository {
  constructor(
    private readonly db: KyselyClient,
    private readonly logger: Logger
  ) {}

  public async create(
    payload: ChefUserLike.Insertable
  ): Promise<Result<ChefUserLike.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.db
        .insertInto('chef_user_likes')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error creating chef user like', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findById(
    id: string
  ): Promise<Result<ChefUserLike.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('chef_user_likes')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error finding chef user like by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findByChefIdAndUserId(
    chefId: string,
    userId: string
  ): Promise<Result<ChefUserLike.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('chef_user_likes')
        .selectAll()
        .where('chef_id', '=', chefId)
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error(
        'Error finding chef user like by chefId and userId',
        error
      )
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findManyByUserId(
    userId: string,
    options: Pagination.Options
  ): Promise<
    Result<Pagination.Paginated<ChefUserLike.Selectable>, ChefRepositoryError>
  > {
    try {
      const query = this.db
        .selectFrom('chef_user_likes')
        .selectAll()
        .where('user_id', '=', userId)
        .limit(options.per_page)
        .offset((options.page - 1) * options.per_page)

      const items = await query.execute()

      const { count } = await this.db
        .selectFrom('chef_user_likes')
        .select((qb) => qb.fn.count('id').as('count'))
        .where('user_id', '=', userId)
        .executeTakeFirstOrThrow()

      const paginatedItems = Pagination.paginate(items, {
        ...options,
        total: Number(count)
      })

      return Result.ok(paginatedItems)
    } catch (error) {
      this.logger.error('Error finding many chef user likes by userId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async updateById(
    id: string,
    payload: ChefUserLike.Updateable
  ): Promise<Result<ChefUserLike.Selectable, ChefRepositoryError>> {
    try {
      const result = await this.db
        .updateTable('chef_user_likes')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error updating chef user like by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async deleteById(
    id: string
  ): Promise<Result<Unit, ChefRepositoryError>> {
    try {
      await this.db
        .deleteFrom('chef_user_likes')
        .where('id', '=', id)
        .executeTakeFirstOrThrow()

      return Result.ok()
    } catch (error) {
      this.logger.error('Error deleting chef user like by id', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async toggleLikeById(
    chefId: string,
    userId: string
  ): Promise<Result<Unit, ChefRepositoryError>> {
    try {
      const existingLike = await this.db
        .selectFrom('chef_user_likes')
        .selectAll()
        .where('chef_id', '=', chefId)
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (existingLike) {
        await this.db
          .updateTable('chef_user_likes')
          .set({ is_liked: !existingLike.is_liked, is_disliked: false })
          .where('id', '=', existingLike.id)
          .execute()
      } else {
        await this.db
          .insertInto('chef_user_likes')
          .values({
            id: ulid(),
            chef_id: chefId,
            user_id: userId,
            is_liked: true,
            is_disliked: false
          })
          .execute()
      }

      return Result.ok()
    } catch (error) {
      this.logger.error('Error toggling chef user like', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async toggleDislikeById(
    chefId: string,
    userId: string
  ): Promise<Result<Unit, ChefRepositoryError>> {
    try {
      const existingLike = await this.db
        .selectFrom('chef_user_likes')
        .selectAll()
        .where('chef_id', '=', chefId)
        .where('user_id', '=', userId)
        .executeTakeFirst()

      if (existingLike) {
        await this.db
          .updateTable('chef_user_likes')
          .set({ is_disliked: !existingLike.is_disliked, is_liked: false })
          .where('id', '=', existingLike.id)
          .execute()
      } else {
        await this.db
          .insertInto('chef_user_likes')
          .values({
            id: ulid(),
            chef_id: chefId,
            user_id: userId,
            is_disliked: true,
            is_liked: false
          })
          .execute()
      }

      return Result.ok()
    } catch (error) {
      this.logger.error('Error toggling chef user dislike', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findManyByChefId(
    chefId: string
  ): Promise<Result<ChefUserLike.Selectable[], ChefRepositoryError>> {
    try {
      const result = await this.db
        .selectFrom('chef_user_likes')
        .selectAll()
        .where('chef_id', '=', chefId)
        .execute()

      return Result.ok(result)
    } catch (error) {
      this.logger.error('Error finding many chef user likes by chefId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async countLikesByChefId(
    chefId: string
  ): Promise<Result<number, ChefRepositoryError>> {
    try {
      const { count } = await this.db
        .selectFrom('chef_user_likes')
        .select((qb) => qb.fn.count('id').as('count'))
        .where('chef_id', '=', chefId)
        .where('is_liked', '=', true)
        .executeTakeFirstOrThrow()

      return Result.ok(Number(count))
    } catch (error) {
      this.logger.error('Error counting likes by chefId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async countDislikesByChefId(
    chefId: string
  ): Promise<Result<number, ChefRepositoryError>> {
    try {
      const { count } = await this.db
        .selectFrom('chef_user_likes')
        .select((qb) => qb.fn.count('id').as('count'))
        .where('chef_id', '=', chefId)
        .where('is_disliked', '=', true)
        .executeTakeFirstOrThrow()

      return Result.ok(Number(count))
    } catch (error) {
      this.logger.error('Error counting dislikes by chefId', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyChefUserLikeRepository
