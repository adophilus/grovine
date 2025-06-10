import Repository from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'

export default async (
  query: Request.Query
): Promise<Result<Response.Success, Response.Error>> => {
  const listRecipesResult = await Repository.listRecipes(query)

  if (listRecipesResult.isErr) {
    return Result.err({
      code: 'ERR_UNEXPECTED'
    })
  }

  const recipes = listRecipesResult.value

  return Result.ok({
    code: 'LIST',
    data: recipes,
    meta: {
      page: query.page,
      per_page: query.per_page,
      total: recipes.length
    }
  })
}
