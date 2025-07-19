import type { Transaction } from '@/types'
import type { Result } from 'true-myth'
import type { Pagination } from '@/features/pagination'

export type TransactionRepositoryError = 'ERR_UNEXPECTED'

abstract class TransactionRepository {
  abstract list(
    payload: Pagination.Options
  ): Promise<Result<Transaction.Selectable[], TransactionRepositoryError>>

  abstract findById(
    id: string
  ): Promise<Result<Transaction.Selectable | null, TransactionRepositoryError>>
}

export default TransactionRepository
