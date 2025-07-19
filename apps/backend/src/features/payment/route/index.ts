import { Hono } from 'hono'
import WebhookRoute from './webhook'

const PaymentRouter = new Hono().route('/webhook', WebhookRoute)

export default PaymentRouter
