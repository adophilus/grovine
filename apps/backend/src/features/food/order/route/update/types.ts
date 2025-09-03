import type { types } from '@grovine/api'
import { schema as apiSchema } from '@grovine/api'
import { z } from 'zod'

export namespace Request {
  export const body =
    apiSchema.schemas.Api_Food_Order_ById_UpdateStatus_Request_Body
  export type Body = z.infer<typeof body>

  export const path = z.object({ id: z.string() })
  export type Path = z.infer<typeof path>
}

export namespace Response {
  type Endpoint = '/foods/orders/{id}'

  export type Response =
    types.paths[Endpoint]['put']['responses'][keyof types.paths[Endpoint]['put']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ORDER_STATUS_UPDATED' }>
  export type Error = Exclude<Response, Success>
}
