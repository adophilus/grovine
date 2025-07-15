import { Hono } from 'hono'
import { cartRouter } from './cart'
import { itemRouter } from './items'
import { orderRouter } from './order'

export default new Hono()
  .route('/items', itemRouter)
  .route('/carts', cartRouter)
  .route('/orders', orderRouter)
