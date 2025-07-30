import type { Result } from 'true-myth'
import type { Referral } from '@/types'

export type ReferralRepositoryError = 'ERR_UNEXPECTED'

abstract class ReferralRepository {
  public abstract create(
    payload: Referral.Insertable
  ): Promise<Result<Referral.Selectable, ReferralRepositoryError>>

  public abstract findByCode(
    code: string
  ): Promise<Result<Referral.Selectable | null, ReferralRepositoryError>>
}

export default ReferralRepository
