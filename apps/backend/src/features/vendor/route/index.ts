import { Hono } from 'hono'
import { CreateVendorRoute } from './create'
import { ReadVendorRoute } from './read'
import { UpdateVendorRoute } from './update'
import { DeleteVendorRoute } from './delete'

const route = new Hono()

route.route('/', CreateVendorRoute)
route.route('/', ReadVendorRoute)
route.route('/', UpdateVendorRoute)
route.route('/', DeleteVendorRoute)

export { route as VendorRoute }
