import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import DeleteNotificationUseCase from './use-case'

export const DeleteNotificationRoute = new Hono().delete('/:id', async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const payload = { id: c.req.param('id') }

  const useCase = Container.get(DeleteNotificationUseCase)
  const result = await useCase.execute(payload)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})