import type { TransactionRepository } from '../../repository'
import { serializeTransaction } from '../../utils'
import type { Response } from './types'
import { Result } from 'true-myth'

class GetTransactionUseCase {
  constructor(private repository: TransactionRepository) {}

  async execute(id: string): Promise<Result<Response.Success, Response.Error>> {
    const result = await this.repository.findById(id)

    if (result.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }
    if (result.value === null) {
      return Result.err({ code: 'ERR_TRANSACTION_NOT_FOUND' })
    }

    const transaction = result.value
    return Result.ok({
      code: 'TRANSACTION_FOUND',
      data: serializeTransaction(transaction)
    })
  }
}

export default GetTransactionUseCase
