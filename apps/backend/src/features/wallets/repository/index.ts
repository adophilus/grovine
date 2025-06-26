import { db } from '@/features/database'
import type { Wallet } from '@/types'
import { Result } from 'true-myth'
import { sql } from 'kysely'
import { logger } from './logger'

namespace Repository {
  export type Error = 'ERR_UNEXPECTED'

  export type CreateWalletPayload = Wallet.Insertable

  export const createWallet = async (
    payload: CreateWalletPayload
  ): Promise<Result<Wallet.Selectable, Error>> => {
    try {
      const wallet = await db
        .insertInto('wallets')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(wallet)
    } catch (err) {
      logger.error('failed to create wallet', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export type FindWalletByIdPayload = { user_id: string }

  export const findWalletById = async (
    id: string
  ): Promise<Result<Wallet.Selectable | null, Error>> => {
    try {
      const wallet = await db
        .selectFrom('wallets')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(wallet ?? null)
    } catch (err) {
      logger.error('failed to find wallet by user id:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const findWalletByUserId = async (
    userId: string
  ): Promise<Result<Wallet.Selectable | null, Error>> => {
    try {
      const wallet = await db
        .selectFrom('wallets')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst()
      return Result.ok(wallet ?? null)
    } catch (err) {
      logger.error('failed to find wallet by user id:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  export const updateWalletBalanceById = async (
    id: string,
    amount: number,
    operation: 'CREDIT' | 'DEBIT'
  ): Promise<Result<Wallet.Selectable, Error>> => {
    try {
      const wallet = await db
        .updateTable('wallets')
        .set((eb) => ({
          balance: eb(
            'balance',
            operation === 'CREDIT' ? '+' : '-',
            amount.toString()
          )
        }))
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(wallet)
    } catch (err) {
      logger.error('failed to update wallet balance by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}
export default Repository
