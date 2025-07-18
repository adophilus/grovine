import { Hono } from 'hono'
import { CreateAdvertRoute } from './create'
import { ListAdvertRoute } from './list'
import { UpdateAdvertRoute } from './update'
import { DeleteAdvertRoute } from './delete'

const AdvertRouter = new Hono()
  .route('/', CreateAdvertRoute)
  .route('/', ListAdvertRoute)
  .route('/', UpdateAdvertRoute)
  .route('/', DeleteAdvertRoute)

export default AdvertRouter
