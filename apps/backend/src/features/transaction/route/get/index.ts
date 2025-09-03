import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import GetTransactionUseCase from './use-case'

const GetTransactionRoute = new Hono().get('/:id', async (c) => {
  const id = c.req.param('id')
  const useCase = Container.get(GetTransactionUseCase)
  const result = await useCase.execute(id)

  let response: Response.Response
  let statusCode: StatusCodes

  if (result.isErr) {
    switch (result.error.code) {
      case 'ERR_TRANSACTION_NOT_FOUND': {
        response = result.error
        statusCode = StatusCodes.NOT_FOUND
        break
      }
      default: {
        response = result.error
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        break
      }
    }
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default GetTransactionRoute
