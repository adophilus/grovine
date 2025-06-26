import { Hono } from 'hono'
import getRouter from './get'
import topupRouter from './topup'
import withdrawRouter from './withdraw'

export default new Hono()
  .route('/', getRouter)
  .route('/topup', topupRouter)
  .route('/withdraw', withdrawRouter)
