import type { MiddlewareHandler } from 'hono'
// import { StatusCodes } from '@/features/http'
// import { config } from '@/features/config'

export const devMiddleware: MiddlewareHandler = async (_c, next) => {
  // if (!config.environment.DEVELOPMENT || !config.environment.TEST) {
  //   return c.json({ error: 'NOT_FOUND' }, StatusCodes.NOT_FOUND)
  // }

  await next()
}
