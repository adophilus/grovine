import { db } from '@/features/database'
import type { Recipe } from '@/types'
import { Result } from 'true-myth'
import { logger } from './logger'

namespace Repository {
  export type Error = 'ERR_UNEXPECTED'

  export type CreateRecipePayload = Recipe.Insertable

  export const createRecipe = async (
    payload: CreateRecipePayload
  ): Promise<Result<Recipe.Selectable, Error>> => {
    try {
      const recipe = await db
        .insertInto('recipes')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(recipe)
    } catch (err) {
      logger.error('failed to create recipe:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default Repository
