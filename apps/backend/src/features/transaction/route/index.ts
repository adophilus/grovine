import { Hono } from 'hono'
import GetTransactionRoute from './get'
import ListTransactionsRoute from './list'

const TransactionRouter = new Hono()
  .route('/', ListTransactionsRoute)
  .route('/', GetTransactionRoute)

export default TransactionRouter
