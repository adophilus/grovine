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

    const transactions = listTransactionsResult.value

    return Result.ok({
      code: 'LIST',
      data: transactions.map(serializeTransaction),
      meta: {
        page: query.page,
        per_page: query.per_page,
        total: transactions.length
      }
    })
  }
}

export default ListTransactionsUseCase
