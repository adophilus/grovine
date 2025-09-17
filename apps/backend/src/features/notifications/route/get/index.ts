import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import GetNotificationCountUseCase from './use-case'

export const GetNotificationCountRoute = new Hono().get('/count', async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const useCase = Container.get(GetNotificationCountUseCase)
  const result = await useCase.execute()

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})