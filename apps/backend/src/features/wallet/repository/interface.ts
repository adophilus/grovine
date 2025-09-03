import type { Result } from 'true-myth'
import type { Wallet } from '@/types'

export type WalletRepositoryError = 'ERR_UNEXPECTED'

abstract class WalletRepository {
  public abstract create(
    payload: Wallet.Insertable
  ): Promise<Result<Wallet.Selectable, WalletRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<Wallet.Selectable | null, WalletRepositoryError>>

  public abstract findByUserId(
    userId: string
  ): Promise<Result<Wallet.Selectable | null, WalletRepositoryError>>

  public abstract updateBalanceById(
    id: string,
    amount: number,
    operation: 'CREDIT' | 'DEBIT'
  ): Promise<Result<Wallet.Selectable, WalletRepositoryError>>
}

export default WalletRepository
