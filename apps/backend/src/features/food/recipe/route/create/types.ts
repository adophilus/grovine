import { schema as apiSchema, type types } from '@grovine/api'
import { z } from 'zod'

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
    apiSchema.schemas.Api_Food_Recipe_Create_Request_Body.omit({
      cover_image: true,
      video: true,
      ingredients: true,
      instructions: true
    }).extend({
      cover_image: z.instanceof(File),
      video: z.instanceof(File),
      ingredients: formDataJsonArraySchema.pipe(
        apiSchema.schemas.Api_Food_Recipe_Create_Request_Body.shape.ingredients
      ),
      instructions: formDataJsonArraySchema.pipe(
        apiSchema.schemas.Api_Food_Recipe_Create_Request_Body.shape.instructions
      )
    })

  export type Body = z.infer<typeof body>
}

export namespace Response {
  type Endpoint = '/foods/recipes'
  type Method = 'post'

  export type Response =
    types.paths[Endpoint][Method]['responses'][keyof types.paths[Endpoint][Method]['responses']]['content']['application/json']

  export type Success = Extract<Response, { code: 'RECIPE_CREATED' }>
  export type Error = Exclude<Response, Success>
}
