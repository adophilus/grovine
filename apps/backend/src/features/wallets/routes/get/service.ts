import Repository from '../../repository'
import type { Response } from './types'
import { Result } from 'true-myth'
import type { User } from '@/types'

export default async (
  actor: User.Selectable
): Promise<Result<Response.Success, Response.Error>> => {
  const topupResult = await Repository.findWalletByUserId(actor.id)

  if (topupResult.isErr) {
    return Result.err({
      code: 'ERR_UNEXPECTED'
    })
  }

  return Result.ok({
    code: 'WALLET_FOUND',
    wallet: topupResult.value
  })
}
