import { Service } from '@n8n/di'
import type { Response } from './types'
import { Result } from 'true-myth'
import type { AdvertRepository } from '../../repository'

@Service()
class DeleteAdvertUseCase {
  constructor(private advertRepository: AdvertRepository) {}

  async execute(id: string): Promise<Result<Response.Success, Response.Error>> {
    const findAdvertResult = await this.advertRepository.findById(id)

    if (findAdvertResult.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    if (!findAdvertResult.value) {
      return Result.err({ code: 'ERR_ADVERTISEMENT_NOT_FOUND' })
    }

    const result = await this.advertRepository.deleteById(id)

    if (result.isErr) {
      return Result.err({ code: 'ERR_UNEXPECTED' })
    }

    return Result.ok({ code: 'ADVERTISEMENT_DELETED' })
  }
}

export default DeleteAdvertUseCase
