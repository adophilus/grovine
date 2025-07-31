import { z } from 'zod'
import { schema as apiSchema, type types } from '@grovine/api'

const formDataJsonArraySchema = z
  .string()
  .default('[]')
  .transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val)
      if (!Array.isArray(parsed)) {
        return [parsed]
      }
      return parsed
    } catch (err) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid JSON string'
      })
    }
  })

export namespace Request {
  export const body =
    apiSchema.schemas.Api_Chef_Profile_Update_Request_Body.omit({
      profile_picture: true,
      niches: true
    }).extend({
      profile_picture: z.instanceof(File).optional(),
      niches: formDataJsonArraySchema.pipe(
        apiSchema.schemas.Api_Chef_Profile_Update_Request_Body.shape.niches
      )
    })
  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/chefs/profile'

  export type Response =
    types.paths[Endpoint]['patch']['responses'][keyof types.paths[Endpoint]['patch']['responses']]['content']['application/json']
  export type Success = Extract<Response, { code: 'CHEF_PROFILE_UPDATED' }>
  export type Error = Exclude<Response, Success>
}
