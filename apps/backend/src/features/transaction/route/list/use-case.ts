import { Pagination } from '@/features/pagination'
import type { TransactionRepository } from '../../repository'
import { serializeTransaction } from '../../utils'
import type { Request, Response } from './types'
import { Result } from 'true-myth'

class ListTransactionsUseCase {
  constructor(private repository: TransactionRepository) {}

  async execute(
    query: Request.Query
  ): Promise<Result<Response.Success, Response.Error>> {
    const listTransactionsResult = await this.repository.list(query)

    if (listTransactionsResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    const paginatedTransactions = listTransactionsResult.value
    const transactions = paginatedTransactions.data
    const serializedTransactions = transactions.map(serializeTransaction)

    return Result.ok({
      code: 'LIST',
      data: Pagination.paginate(
        serializedTransactions,
        paginatedTransactions.meta
      )
    })
  }
}

export default ListTransactionsUseCase
