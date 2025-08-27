import { zValidator } from '@hono/zod-validator'
import { Request } from './types'

export default [
  zValidator('param', Request.path),
  zValidator('json', Request.body)
] as const
