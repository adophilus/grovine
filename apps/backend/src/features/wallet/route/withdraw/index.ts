import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import WithdrawWalletUseCase from './use-case'

const WithdrawWalletRoute = new Hono().post('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const payload = c.req.valid('json')

  const useCase = Container.get(WithdrawWalletUseCase)
  const result = await useCase.execute(payload)

  if (result.isErr) {
    response = result.error
    switch (result.error.code) {
      case 'ERR_INSUFFICIENT_FUNDS': {
        statusCode = StatusCodes.BAD_REQUEST
        break
      }
      default: {
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      }
    }
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default WithdrawWalletRoute
