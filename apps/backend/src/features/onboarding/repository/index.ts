import { db } from '@/features/database'
import type { UserPreference } from '@/types'
import { Result } from 'true-myth'
import { logger } from './logger'

namespace Repository {
  export type Error = 'ERR_UNEXPECTED'

  export type CreateUserPreferencesPayload = UserPreference.Insertable

  export const createUserPreferences = async (
    payload: CreateUserPreferencesPayload
  ): Promise<Result<UserPreference.Selectable, Error>> => {
    try {
      const user = await db
        .insertInto('user_preferences')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(user)
    } catch (err) {
      logger.error('failed to create user preference:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const findUserPreferencesByUserId = async (
    id: string
  ): Promise<Result<UserPreference.Selectable | null, Error>> => {
    try {
      const userPreferences = await db
        .selectFrom('user_preferences')
        .selectAll()
        .where('user_id', '=', id)
        .executeTakeFirst()
      return Result.ok(userPreferences ?? null)
    } catch (err) {
      logger.error('failed to find user preferences by user id:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default Repository
