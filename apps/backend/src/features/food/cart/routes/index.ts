import { Hono } from 'hono'
import setItemRouter from './set-item'
import getRouter from './get'
import checkoutRouter from './checkout'

export default new Hono()
  .route('/', setItemRouter)
  .route('/', getRouter)
  .route('/checkout', checkoutRouter)
