import { db } from '@/features/database'
import type { Token, User } from '@/types'
import { Result } from 'true-myth'
import { logger } from './logger'

namespace Repository {
  export type Error = 'ERR_UNEXPECTED'

  export type CreateUserPayload = User.Insertable

  export const createUser = async (
    payload: CreateUserPayload
  ): Promise<Result<User.Selectable, Error>> => {
    try {
      const user = await db
        .insertInto('users')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(user)
    } catch (err) {
      logger.error('failed to create user:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const findUserByEmail = async (
    email: string
  ): Promise<Result<User.Selectable | null, Error>> => {
    try {
      const user = await db
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst()
      return Result.ok(user ?? null)
    } catch (err) {
      logger.error('failed to find user by email:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const findUserById = async (
    id: string
  ): Promise<Result<User.Selectable | null, Error>> => {
    try {
      const user = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(user ?? null)
    } catch (err) {
      logger.error('failed to find user by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type UpdateUserByIdPayload = Omit<
    User.Updateable,
    'id' | 'referral_code' | 'updated_at'
  >

  export const updateUserById = async (
    id: string,
    payload: UpdateUserByIdPayload
  ): Promise<Result<User.Selectable, Error>> => {
    try {
      const user = await db
        .updateTable('users')
        .set(
          Object.assign(payload, {
            updated_at: new Date().toISOString()
          })
        )
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(user)
    } catch (err) {
      logger.error('failed to update user by id with payload', id, payload, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type CreateToken = Token.Insertable

  export const createToken = async (
    payload: CreateToken
  ): Promise<Result<Token.Selectable, Error>> => {
    try {
      const token = await db
        .insertInto('tokens')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(token)
    } catch (err) {
      logger.error('failed to create sign up verification token:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type FindTokenByUserIdAndPurposePayload = {
    user_id: string
    purpose: string
  }

  export const findTokenByUserIdAndPurpose = async (
    payload: FindTokenByUserIdAndPurposePayload
  ): Promise<Result<Token.Selectable | null, Error>> => {
    try {
      const token = await db
        .selectFrom('tokens')
        .selectAll()
        .where('user_id', '=', payload.user_id)
        .where('purpose', '=', payload.purpose)
        .executeTakeFirst()
      return Result.ok(token ?? null)
    } catch (err) {
      logger.error(
        'failed to find token by user id and purpose:',
        payload.user_id,
        payload.purpose,
        err
      )
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type UpdateTokenByIdPayload = Omit<
    Token.Updateable,
    'id' | 'purpose' | 'user_id' | 'updated_at'
  >

  export const updateTokenById = async (
    id: Token.Selectable['id'],
    payload: UpdateTokenByIdPayload
  ): Promise<Result<Token.Selectable, Error>> => {
    try {
      const token = await db
        .updateTable('tokens')
        .set(payload)
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(token)
    } catch (err) {
      logger.error('failed to update token by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default Repository
