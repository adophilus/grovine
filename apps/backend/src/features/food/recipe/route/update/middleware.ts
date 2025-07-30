import { zValidator } from '@/features/http'
import { Request } from './types'

export default [
  zValidator('param', Request.params),
  zValidator('form', Request.body)
] as const
