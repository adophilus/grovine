import { Hono } from 'hono'
import { CreateVendorRoute } from './create'
import { ReadVendorRoute } from './read'
import { UpdateVendorRoute } from './update'

const VendorRouter = new Hono()
  .route('/', CreateVendorRoute)
  .route('/', ReadVendorRoute)
  .route('/', UpdateVendorRoute)

export default VendorRouter
