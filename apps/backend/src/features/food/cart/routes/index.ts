import { Hono } from 'hono'
import setItemRouter from './set-item'
import listRouter from './list'
import checkoutRouter from './checkout'

export default new Hono()
  .route('/', setItemRouter)
  .route('/', listRouter)
  .route('/checkout', checkoutRouter)
