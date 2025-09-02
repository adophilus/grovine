import { Hono } from 'hono'
import UpdateUserRoleRoute from './update'

const UsersRouter = new Hono().route('/', UpdateUserRoleRoute)

export default UsersRouter
