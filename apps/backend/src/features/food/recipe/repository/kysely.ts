import type { KyselyClient } from '@/features/database/kysely'
import type FoodRecipeRepository from './interface'
import type { Logger } from '@/features/logger'
import type { FoodRecipe } from '@/types'
import { Result, type Unit } from 'true-myth'
import type { FoodRecipeRepositoryError } from './interface'
import { Pagination } from '@/features/pagination'

class KyselyFoodRecipeRepository implements FoodRecipeRepository {
  constructor(
    private readonly client: KyselyClient,
    private readonly logger: Logger
  ) {}

  async create(
    payload: FoodRecipe.Insertable
  ): Promise<Result<FoodRecipe.Selectable, FoodRecipeRepositoryError>> {
    try {
      const [createdRecipe] = await this.client
        .insertInto('food_recipes')
        .values(payload)
        .returningAll()
        .execute()

      return Result.ok(createdRecipe)
    } catch (error) {
      this.logger.error('Failed to create food recipe', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findById(
    id: string
  ): Promise<Result<FoodRecipe.Selectable | null, FoodRecipeRepositoryError>> {
    try {
      const recipe = await this.client
        .selectFrom('food_recipes')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()

      return Result.ok(recipe ?? null)
    } catch (error) {
      this.logger.error(`Failed to find food recipe with id ${id}`, error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findMany(
    options: Pagination.Options
  ): Promise<
    Result<
      Pagination.Paginated<FoodRecipe.Selectable>,
      FoodRecipeRepositoryError
    >
  > {
    try {
      const recipes = await this.client
        .selectFrom('food_recipes')
        .selectAll()
        .offset((options.page - 1) * options.per_page)
        .limit(options.per_page)
        .execute()

      const { total } = await this.client
        .selectFrom('food_recipes')
        .select((eb) => eb.fn.countAll().as('total'))
        .executeTakeFirstOrThrow()

      const paginatedRecipes = Pagination.paginate(recipes, {
        ...options,
        total: Number(total)
      })

      return Result.ok(paginatedRecipes)
    } catch (error) {
      this.logger.error('Failed to list food recipes', error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async updateById(
    id: string,
    payload: FoodRecipe.Updateable
  ): Promise<Result<FoodRecipe.Selectable, FoodRecipeRepositoryError>> {
    try {
      const [updatedRecipe] = await this.client
        .updateTable('food_recipes')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .execute()

      return Result.ok(updatedRecipe)
    } catch (error) {
      this.logger.error(`Failed to update food recipe with id ${id}`, error)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async deleteById(
    id: string
  ): Promise<Result<Unit, FoodRecipeRepositoryError>> {
    try {
      await this.client
        .deleteFrom('food_recipes')
        .where('id', '=', id)
        .execute()

      return Result.ok()
    } catch (error) {
      this.logger.error(`Failed to delete food recipe with id ${id}`, error)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyFoodRecipeRepository
