import { Hono } from 'hono'
import { devMiddleware } from '@/features/dev/middleware'
import UsersRouter from '@/features/dev/users/route'

const DevRouter = new Hono().use(devMiddleware).route('/users', UsersRouter)

export default DevRouter
