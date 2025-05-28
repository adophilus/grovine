import { Hono } from 'hono'
import sendEmailRouter from './send-email'
import confirmRouter from './confirm'

const router = new Hono().route('/', sendEmailRouter).route('/', confirmRouter)

export default new Hono().route('/reset-password', router)
