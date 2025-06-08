import type { z } from 'zod'
import { schema as apiSchema, type types } from '@grovine/api'

export namespace Request {
  export const body = apiSchema.schemas.Api_Food_Recipe_Create_Request_Body

  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/foods/recipes'

  export type Response =
    types.paths[Endpoint]['post']['responses'][keyof types.paths[Endpoint]['post']['responses']]['content']['application/json']
  export type Success = Extract<Response, { code: 'RECIPE_CREATED' }>
  export type Error = Exclude<Response, Success>
}
