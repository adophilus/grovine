import { sql } from 'kysely'
import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import type { Wallet } from '@/types'
import type WalletRepository from './interface'
import type { WalletRepositoryError } from './interface'

class WalletKyselyRepository implements WalletRepository {
  constructor(
    private logger: Logger,
    private client: KyselyClient
  ) {}

  public async create(
    payload: Wallet.Insertable
  ): Promise<Result<Wallet.Selectable, WalletRepositoryError>> {
    try {
      const wallet = await this.client
        .insertInto('wallets')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(wallet)
    } catch (err) {
      this.logger.error('failed to create wallet', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findById(
    id: string
  ): Promise<Result<Wallet.Selectable | null, WalletRepositoryError>> {
    try {
      const wallet = await this.client
        .selectFrom('wallets')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(wallet ?? null)
    } catch (err) {
      this.logger.error('failed to find wallet by user id:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findByUserId(
    userId: string
  ): Promise<Result<Wallet.Selectable | null, WalletRepositoryError>> {
    try {
      const wallet = await this.client
        .selectFrom('wallets')
        .selectAll()
        .where('user_id', '=', userId)
        .executeTakeFirst()
      return Result.ok(wallet ?? null)
    } catch (err) {
      this.logger.error('failed to find wallet by user id:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async updateBalanceById(
    id: string,
    amount: number,
    operation: 'CREDIT' | 'DEBIT'
  ): Promise<Result<Wallet.Selectable, WalletRepositoryError>> {
    try {
      const wallet = await this.client
        .updateTable('wallets')
        .set({
          balance:
            operation === 'CREDIT'
              ? sql`balance + ${amount}`
              : sql`balance - ${amount}`
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(wallet)
    } catch (err) {
      this.logger.error('failed to update wallet balance by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default WalletKyselyRepository
