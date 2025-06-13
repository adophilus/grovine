import { Hono } from 'hono'
import cartRouter from './cart/routes'
import itemsRouter from './items/routes'

export default new Hono()
  .route('/items', itemsRouter)
  .route('/carts', cartRouter)
