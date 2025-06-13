import { Hono } from 'hono'
import items from '../items/routes'
import carts from './carts'

export default new Hono().route('/items', items).route('/carts', carts)
