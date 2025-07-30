import type { Transaction } from '@/types'
import { Result } from 'true-myth'
import type { Pagination } from '@/features/pagination'
import type { Logger } from '@/features/logger'
import type { KyselyClient } from '@/features/database/kysely'
import type TransactionRepository from './interface'
import type { TransactionRepositoryError } from './interface'

class KyselyTransactionRepository implements TransactionRepository {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  async list(
    payload: Pagination.Options
  ): Promise<Result<Transaction.Selectable[], TransactionRepositoryError>> {
    try {
      const transactions = await this.client
        .selectFrom('transactions')
        .selectAll()
        .limit(payload.per_page)
        .offset(payload.page)
        .execute()
      return Result.ok(transactions)
    } catch (err) {
      this.logger.error('failed to get transactions')
      return Result.err('ERR_UNEXPECTED')
    }
  }

  async findById(
    id: string
  ): Promise<
    Result<Transaction.Selectable | null, TransactionRepositoryError>
  > {
    try {
      const transaction = await this.client
        .selectFrom('transactions')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(transaction ?? null)
    } catch (err) {
      this.logger.error('failed to get transaction by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyTransactionRepository
