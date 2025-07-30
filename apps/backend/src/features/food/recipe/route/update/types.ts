import { schema as apiSchema, type types } from '@grovine/api'
import { z } from 'zod'

export namespace Request {
  export const params = z.object({
    id: z.string().ulid()
  })

  export const body =
    apiSchema.schemas.Api_Food_Recipe_ById_Update_Request_Body.omit({
      cover_image: true,
      video: true
    }).extend({
      cover_image: z.instanceof(File).optional(),
      video: z.instanceof(File).optional()
    })

  export type Params = z.infer<typeof params>
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/foods/recipes/{id}'
  type Method = 'patch'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'RECIPE_UPDATED' }>
  export type Error = Exclude<Response, Success>
}
