import Repository from '../../repository'
import type { Response } from './types'
import { Result } from 'true-myth'


export default async (
  id: string
): Promise<Result<Response.Success, Response.Error>> => {
  const result = await Repository.getTransactionById(id)

  if (result.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }
  if (result.value === null) {
    return Result.err({ code: 'ERR_TRANSACTION_NOT_FOUND' })
  }

  const transaction = result.value
  return Result.ok({
    code: "TRANSACTION_FOUND",
    data: transaction
  })
}
