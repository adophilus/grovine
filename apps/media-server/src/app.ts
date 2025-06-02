import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import router from './router'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

export const app = new Hono()
  .use(logger())
  .use('/*', cors())
  .get(
    '/public/*',
    serveStatic({
      root: './'
    })
  )
  .route('/v1_1/:cloud_name/image', router)

export type App = typeof app
export default app
