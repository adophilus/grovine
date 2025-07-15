import { Hono } from 'hono'
import listRouter from './list'
import getRouter from './get'
import updateRouter from './update'

export default new Hono()
  .route('/', listRouter)
  .route('/', getRouter)
  .route('/', updateRouter)
