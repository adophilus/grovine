import { db } from '@/features/database'
import type { Wallet } from '@/types'
import { Result } from 'true-myth'
import { sql } from 'kysely'

namespace Repository {
  export type Error = 'ERR_UNEXPECTED'

  export type CreateWalletPayload = Wallet.Insertable
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
      console.error('failed to find wallet by user id:', err)
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
      console.error('failed to find wallet by user id:', err)
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
        .set({
          balance: sql`balance ${operation === 'CREDIT' ? '+' : '-'} ${amount}`
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(wallet)
    } catch (err) {
      console.error('failed to top up wallet:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}
export default Repository
