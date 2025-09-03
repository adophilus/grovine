import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import { Pagination } from '@/features/pagination'
import type { Transaction } from '@/types'
import type TransactionRepository from './interface'
import type { TransactionRepositoryError } from './interface'

class KyselyTransactionRepository implements TransactionRepository {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  async list(
    options: Pagination.Options
  ): Promise<
    Result<
      Pagination.Paginated<Transaction.Selectable>,
      TransactionRepositoryError
    >
  > {
    try {
      const transactions = await this.client
        .selectFrom('transactions')
        .selectAll()
        .limit(options.per_page)
        .offset(options.page)
        .execute()

      const { total } = await this.client
        .selectFrom('transactions')
        .select((eb) => eb.fn.countAll().as('total'))
        .executeTakeFirstOrThrow()

      const paginatedTransactions = Pagination.paginate(transactions, {
        ...options,
        total: Number(total)
      })

      return Result.ok(paginatedTransactions)
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
