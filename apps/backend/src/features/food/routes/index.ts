import { Hono } from 'hono'
import items from '../items/routes'
import carts from '../cart/routes'

export default new Hono().route('/items', items).route('/carts', carts)
