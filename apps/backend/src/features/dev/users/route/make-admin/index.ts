import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import MakeUserAdminUseCase from './use-case'
import middleware from './middleware'

const MakeAdminRoute = new Hono().post('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const { user_id } = c.req.valid('json')

  const useCase = Container.get(MakeUserAdminUseCase)
  const makeAdminResult = await useCase.execute(user_id)

  if (makeAdminResult.isErr) {
    response = makeAdminResult.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = makeAdminResult.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default MakeAdminRoute
