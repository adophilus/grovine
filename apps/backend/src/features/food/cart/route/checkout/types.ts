import { schema as apiSchema, type types } from '@grovine/api'
import type { z } from 'zod'

export namespace Request {
  export const body = apiSchema.schemas.Api_Food_Cart_Checkout_Request_Body

  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/foods/carts/checkout'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'CHECKOUT_SUCCESSFUL' }>
  export type Error = Exclude<Response, Success>
}
