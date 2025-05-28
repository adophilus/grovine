import { zValidator } from '@hono/zod-validator'
import { bodySchema, paramSchema } from './schema'

export const bodyMiddleware = zValidator('json', bodySchema)
export const paramMiddleware = zValidator('param', paramSchema)

export default [bodyMiddleware, paramMiddleware] as const
