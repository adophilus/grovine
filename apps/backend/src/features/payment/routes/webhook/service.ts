import type { Result } from 'true-myth'
import type { Request } from './types'
import { handleWebhookEvent } from '../../utils'

export default async (
  payload: Request.Body
): Promise<Result<unknown, unknown>> => handleWebhookEvent(payload)
