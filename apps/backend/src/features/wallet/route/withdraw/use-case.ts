import type { Request, Response } from './types'
import { Result } from 'true-myth'

class WithdrawWalletUseCase {
  public async execute(
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    // TODO: more logic is required here

    return Result.ok({
      code: 'WALLET_WITHDRAWAL_REQUEST_SUCCESSFUL'
    })
  }
}

export default WithdrawWalletUseCase
