import { Hono } from 'hono'
import type { Response } from './types'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import UpdateUserRoleUseCase from './use-case'
import middleware from './middleware'

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
