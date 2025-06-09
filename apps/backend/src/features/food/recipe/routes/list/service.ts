import Repository from '../../repository'
import type { Response } from './types'
import { Result } from 'true-myth'

export default async (
  query: Record<string, string>
): Promise<Result<Response.Success, Response.Error>> => {
  const recipes = await Repository.listFoods(query)

  return Result.ok(recipes)
}
