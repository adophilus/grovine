import { ulid } from 'ulidx'
import Repository from '../../repository'
import type { Request, Response } from './types'
import { Result } from 'true-myth'
import { Storage } from '@/features/storage'

export default async (
  payload: Request.Body
): Promise<Result<Response.Success, Response.Error>> => {
  const { image, ..._payload } = payload

  const uploadImageResult = await Storage.service.upload(image)

  if (uploadImageResult.isErr) {
    return Result.err({
      code: 'ERR_UNEXPECTED'
    })
  }

  const uploadedImage = uploadImageResult.value

  const createRecipeResult = await Repository.createRecipe({
    ..._payload,
    price: _payload.price.toString(),
    image: uploadedImage,
    id: ulid()
  })

  if (createRecipeResult.isErr) {
    return Result.err({
      code: 'ERR_UNEXPECTED'
    })
  }

  return Result.ok({
    code: 'RECIPE_CREATED'
  })
}
