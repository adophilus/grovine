import Repository from '../../repository'
import type { Response } from './types'
import { Result } from 'true-myth'

export default async (
  id: string
): Promise<Result<Response.Success, Response.Error>> => {
  const findItemResult = await Repository.findItemById(id)

  if (findItemResult.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  if (!findItemResult.value) {
    return Result.err({ code: 'ERR_ITEM_NOT_FOUND' })
  }

  const result = await Repository.deleteItemById(id)

  if (result.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  return Result.ok({ code: 'ITEM_DELETED' })
}
