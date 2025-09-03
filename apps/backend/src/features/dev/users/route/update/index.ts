import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import UpdateUserRoleUseCase from './use-case'

const UpdateUserRoute = new Hono().patch('/:id', ...middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const { id } = c.req.valid('param')
  const { role } = c.req.valid('json')

  const useCase = Container.get(UpdateUserRoleUseCase)
  const makeAdminResult = await useCase.execute({ id, role })

  if (makeAdminResult.isErr) {
    response = makeAdminResult.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = makeAdminResult.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default UpdateUserRoute
