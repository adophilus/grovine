import { Result } from 'true-myth'
import type { User } from '@/types'
import type { WalletRepository } from '../../repository'
import type { Response } from './types'

class GetWalletUseCase {
  constructor(private walletRepository: WalletRepository) {}

  public async execute(
    actor: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const findWalletResult = await this.walletRepository.findByUserId(actor.id)

    if (findWalletResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    return Result.ok({
      code: 'WALLET_FOUND',
      wallet: findWalletResult.value
    })
  }
}

export default GetWalletUseCase
