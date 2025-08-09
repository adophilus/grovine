import { Hono } from 'hono'
import OnboardingRouter from '@/features/onboarding/route'
import AdvertRouter from '@/features/advert/route'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { otel } from '@hono/otel'
import { logger as honoLogger } from 'hono/logger'
import type { Logger } from '@/features/logger'
import { StatusCodes } from '@/features/http'
import AuthRouter from '@/features/auth/route'
import type App from './interface'
import WalletRouter from '@/features/wallet/route'
import PaymentRouter from '@/features/payment/route'
import FoodRouter from '@/features/food/route'
import ChefRoute from '@/features/chef/route'

class HonoApp implements App {
  constructor(private logger: Logger) {}

  create() {
    const ApiRouter = new Hono()
      .route('/auth', AuthRouter)
      .route('/ads', AdvertRouter)
      .route('/onboarding', OnboardingRouter)
      .route('/foods', FoodRouter)
      .route('/wallets', WalletRouter)
      .route('/payment', PaymentRouter)
      .route('/chefs', ChefRoute)

    return (
      new Hono()
        // .use('*', otel())
        .use(compress())
        .use(cors())
        .use(honoLogger())
        .route('/', ApiRouter)
        .get('/', (c) => {
          this.logger.info('Health', 'check')
          return c.json({ message: 'Welcome to Grovine API' })
        })
        .notFound((c) => c.json({ error: 'NOT_FOUND' }, StatusCodes.NOT_FOUND))
        .onError((err, c) => {
          this.logger.error('An unexpected error occurred:', err)
          return c.json(
            { code: 'ERR_UNEXPECTED' },
            StatusCodes.INTERNAL_SERVER_ERROR
          )
        })
    )
  }
}

export default HonoApp
