import type { types } from '@grovine/api'
import { schema as apiSchema } from '@grovine/api'
import type { z } from 'zod'

export namespace Request {
  export const body = apiSchema.schemas.Api_Food_Cart_SetItem_Request_Body
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/foods/carts'

  export type Response =
    types.paths[Endpoint]['put']['responses'][keyof types.paths[Endpoint]['put']['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'ITEM_ADDED_TO_CART' }>
  export type Error = Exclude<Response, Success>
}
