import { db } from '@/features/database'
import type { Recipe } from '@/types'
import { Result } from 'true-myth'
import { logger } from './logger'
import type { Pagination } from '@/features/pagination'

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

  export type ListRecipesPayload = Pagination.Options

  export const listRecipes = async (
    payload: ListRecipesPayload
  ): Promise<Result<Recipe.Selectable[], Error>> => {
    try {
      const recipes = await db
        .selectFrom('recipes')
        .selectAll()
        .limit(payload.per_page)
        .offset(payload.page)
        .execute()

      return Result.ok(recipes)
    } catch (err) {
      logger.error('failed to list recipes:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type CreateRecipePayload = {
    name: string
    category: string
    price: number
    description?: string
    image_url?: string
    is_available?: boolean // Optional field, added just in case
  }
  export const createRecipe = async (
    payload: CreateRecipePayload
  ): Promise<Result<any, Error>> => {
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

  export type FindRecipeByIdPayload = {
    id: string
  }
  export const findRecipeById = async (
    payload: FindRecipeByIdPayload
  ): Promise<Result<User.Selectable | null, Error>> => {
    try {
      const recipe = await db
        .selectFrom('recipes')
        .selectAll()
        .where('id', '=', payload.id)
        .executeTakeFirst()
      return Result.ok(recipe ?? null)
    } catch (err) {
      logger.error('failed to find recipe by id:', payload.id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type UpdateRecipeByIdPayload = {
    name?: string
    category?: string
    price?: number
    description?: string
    image_url?: string
    is_available?: boolean // Optional field, still dont know sha
  }

  function cleanPayload(
    payload: UpdateRecipeByIdPayload
  ): Partial<UpdateRecipeByIdPayload> {
    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined)
    )
  }

  export const updateRecipeById = async (
    id: string,
    payload: UpdateRecipeByIdPayload
  ): Promise<Result<Recipe.Selectable, Error>> => {
    try {
      const cleanedPayload = cleanPayload(payload)

      if (Object.keys(cleanedPayload).length === 0) {
        return Result.err('NO_FIELDS_TO_UPDATE')
      }

      const recipe = await db
        .updateTable('recipes')
        .set({
          ...cleanedPayload,
          updated_at: new Date().toISOString()
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      return Result.ok(recipe)
    } catch (err) {
      logger.error('failed to update recipe by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type DeleteRecipeByIdPayload = {
    id: string
  }
  export const deleteRecipeById = async (
    payload: DeleteRecipeByIdPayload
  ): Promise<Result<void, Error>> => {
    try {
      await db.deleteFrom('recipes').where('id', '=', payload.id).execute()
      return Result.ok(undefined)
    } catch (err) {
      logger.error('failed to delete recipe by id:', payload.id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  //Advertisement section
  export type CreateAdvertisementPayload = {
    media: string
    expires_at: string
  }

  export const createAdvertisement = async (
    payload: CreateAdvertisementPayload
  ): Promise<Result<Advertisement, Error>> => {
    try {
      const ad = await db
        .insertInto('advertisements')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(ad)
    } catch (err) {
      logger.error('failed to create advertisement:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const listAdvertisements = async (
    limit?: number,
    offset?: number
  ): Promise<Result<Advertisement[], Error>> => {
    try {
      let query = db.selectFrom('advertisements').selectAll()
      if (limit) query = query.limit(limit)
      if (offset) query = query.offset(offset)
      const ads = await query.execute()
      return Result.ok(ads)
    } catch (err) {
      logger.error('failed to list advertisements:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const findAdvertisementById = async (
    id: string
  ): Promise<Result<Advertisement | null, Error>> => {
    try {
      const ad = await db
        .selectFrom('advertisements')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(ad ?? null)
    } catch (err) {
      logger.error('failed to find advertisement by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const updateAdvertisementById = async (
    id: string,
    payload: Partial<CreateAdvertisementPayload>
  ): Promise<Result<Advertisement, Error>> => {
    try {
      const ad = await db
        .updateTable('advertisements')
        .set({ ...payload, updated_at: new Date().toISOString() })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(ad)
    } catch (err) {
      logger.error('failed to update advertisement by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const deleteAdvertisementById = async (
    id: string
  ): Promise<Result<void, Error>> => {
    try {
      await db
        .deleteFrom('advertisements')
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(undefined)
    } catch (err) {
      logger.error('failed to delete advertisement by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
  //My changes stopes here
}

export default Repository
