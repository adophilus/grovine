import { Hono } from 'hono'
import { authRouter } from './features/auth'
import { onboardingRouter } from './features/onboarding'
import { foodRouter } from './features/food'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger as honoLogger } from 'hono/logger'
import { globalLogger } from './features/logger'
import { StatusCodes } from './features/http'

const apiRoutes = new Hono()
  .route('/auth', authRouter)
  .route('/onboarding', onboardingRouter)
  .route('/foods', foodRouter)

export const logger = globalLogger.getSubLogger({ name: 'ServerLogger' })

export const app = new Hono()
  .use(compress())
  .use(cors())
  .use(honoLogger())
  .route('/', apiRoutes)
  .notFound((c) => c.json({ error: 'NOT_FOUND' }, StatusCodes.NOT_FOUND))
  .onError((err, c) => {
    console.log('An unexpected error occurred:', err)
    return c.json({ code: 'ERR_UNEXPECTED' }, StatusCodes.INTERNAL_SERVER_ERROR)
  })

export type App = typeof app
