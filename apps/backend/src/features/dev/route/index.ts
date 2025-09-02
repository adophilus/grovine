import { Hono } from 'hono'
import UsersRouter from '@/features/dev/users/route'
import { devMiddleware } from '@/features/dev/middleware'

const DevRouter = new Hono()
  .use(devMiddleware)
  .route('/users', UsersRouter)

export default DevRouter