import { Hono } from 'hono'
import GetActiveChefProfileRoute from './get'
import UpdateActiveChefProfileRoute from './update'

const ChefProfileRoute = new Hono()
  .basePath('/profile')
  .route('/', GetActiveChefProfileRoute)
  .route('/', UpdateActiveChefProfileRoute)

export default ChefProfileRoute
