import Repository from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { Storage } from '@/features/storage'
import { serializeRecipe } from '../../utils'

export default async (
  id: string,
  payload: Request.Body
): Promise<Result<Response.Success, Response.Error>> => {
  const { image, ..._payload } = payload

  let updatedPayload = { ..._payload }

  if (image) {
    const uploadImageResult = await Storage.service.upload(image)

    if (uploadImageResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    updatedPayload = {
      ...updatedPayload,
      image: uploadImageResult.value
    }
  }

  const updateRecipeResult = await Repository.updateRecipeById(id, updatedPayload)

  if (updateRecipeResult.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }
  
  const updatedRecipe = updateRecipeResult.value

  return Result.ok({
    code: 'RECIPE_UPDATED',
    data: serializeRecipe(updatedRecipe)
  })
}

