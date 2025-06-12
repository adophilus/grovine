import Repository from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { Storage } from '@/features/storage'
import { serializeRecipe } from '../../utils'
import type { UploadedData } from '@/features/storage/types'

export default async (
  id: string,
  payload: Request.Body
): Promise<Result<Response.Success, Response.Error>> => {
  const { image, ..._payload } = payload

  let updatedImage: UploadedData | undefined = undefined

  if (image) {
    const uploadImageResult = await Storage.service.upload(image)

    if (uploadImageResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }
    
    updatedImage = uploadImageResult.value
  }

  const updatePayload = {
    ..._payload,
    image: updatedImage,
    price: _payload.price?.toString()
  }

  const updateRecipeResult = await Repository.updateRecipeById(id, updatePayload)

  if (updateRecipeResult.isErr) {
    return Result.err({ code: 'ERR_UNEXPECTED' })
  }
  
  const updatedRecipe = updateRecipeResult.value

  return Result.ok({
    code: 'RECIPE_UPDATED',
    data: serializeRecipe(updatedRecipe)
  })
}

