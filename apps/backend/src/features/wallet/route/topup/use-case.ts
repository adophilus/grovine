import assert from 'node:assert'
import { Result } from 'true-myth'
import type { PaymentService } from '@/features/payment/service'
import { createWalletTopupInvoicePayload } from '@/features/payment/utils'
import type { User } from '@/types'
import type { WalletRepository } from '../../repository'
import type { Request, Response } from './types'

class TopupWalletUseCase {
  constructor(
    private walletRepository: WalletRepository,
    private paymentService: PaymentService
  ) {}

  public async execute(
    payload: Request.Body,
    actor: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    const findWalletResult = await this.walletRepository.findByUserId(actor.id)
    if (findWalletResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const wallet = findWalletResult.value

    assert(wallet, 'Impossible for user to not have a wallet')

    const topupInvoiceResult = await this.paymentService.createInvoice(
      createWalletTopupInvoicePayload({
        email: actor.email,
        amount: payload.amount,
        wallet_id: wallet.id
      })
    )

    if (topupInvoiceResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const topupInvoice = topupInvoiceResult.value

    return Result.ok({
      code: 'WALLET_TOPUP_REQUEST_SUCCESSFUL',
      data: {
        url: topupInvoice.url
      }
    })
  }
}

export default TopupWalletUseCase
