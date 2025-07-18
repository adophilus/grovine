import { Hono } from 'hono'
import ListTransactionsRoute from './list'
import GetTransactionRoute from './get'

const TransactionRouter = new Hono()
  .route('/', ListTransactionsRoute)
  .route('/', GetTransactionRoute)

export default TransactionRouter
