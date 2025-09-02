import { Hono } from 'hono'
import MakeAdminRoute from './make-admin'

const UsersRouter = new Hono()
  .route('/make-admin', MakeAdminRoute)

export default UsersRouter