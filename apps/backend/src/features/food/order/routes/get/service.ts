import { Result } from 'true-myth'
import Repository from '../../repository'
import type { Request, Response } from './types'
import { serializeOrderWithItems } from '../../utils'

export default async (
  payload: Request.Path
): Promise<Result<Response.Success, Response.Error>> => {
  const result = await Repository.findOrderById(payload.id)

  if (result.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  const order = result.value

  if (!order) {
    return Result.err({
      code: 'ERR_ORDER_NOT_FOUND'
    })
  }

  return Result.ok({
    code: 'ORDER_FOUND',
    data: serializeOrderWithItems(order)
  })
}
