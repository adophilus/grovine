import type { Request, Response } from './types'
import Repository from '../../repository'
import { Result } from 'true-myth'

type Payload = Request.Body & Request.Path

export default async function service(
  payload: Payload
): Promise<Result<Response.Success, Response.Error>> {
  const result = await Repository.updateOrderStatusById(
    payload.id,
    payload.status
  )

  if (result.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }

  if (!result.value) {
    return Result.err({ code: 'ERR_ORDER_NOT_FOUND' })
  }

  return Result.ok({ code: 'ORDER_STATUS_UPDATED' })
}
