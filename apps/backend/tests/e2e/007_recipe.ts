import { assert, describe, test } from 'vitest'
import { ulid } from 'ulidx'
import { client, bodySerializer, getStore } from '../utils'
import { FoodRecipeRepository } from '@/features/food/recipe/repository'
import { Container } from '@n8n/di'

describe('food recipes', async () => {
  const foodRecipeRepository = Container.get(FoodRecipeRepository)

  const imageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
  const imageBuffer = Buffer.from(imageBase64, 'base64')
  const image = new File([imageBuffer], 'test.png', { type: 'image/png' })
  const video = new File([imageBuffer], 'test.mp4', { type: 'video/mp4' })

  let recipeId: string

  test('create recipe', async () => {
    const res = await client.POST('/foods/recipes', {
      body: {
        title: 'Test Recipe',
        description: 'Test Description',
        ingredients: [{ id: 'test', quantity: 1 }],
        instructions: [{ title: 'Boil', content: 'Boil over a stove' }],
        cover_image: image,
        video
      },
      bodySerializer
    })

    assert(
      !res.error,
      `Create recipe should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'RECIPE_CREATED',
      'Response should have RECIPE_CREATED code'
    )

    recipeId = res.data.data.id
  })

  test('create recipe with invalid data', async () => {
    const res = await client.POST('/foods/recipes', {
      body: {
        title: 'Test Recipe',
        ingredients: [],
        instructions: [],
        cover_image: image,
        video
      } as any,
      bodySerializer
    })

    assert(res.error, 'Should return an error for invalid data')
    assert(
      res.error?.code === 'ERR_EXPECTED_DATA_NOT_RECEIVED',
      'Should return validation error'
    )
  })

  test('get recipe', async () => {
    const res = await client.GET('/foods/recipes/{id}', {
      params: {
        path: { id: recipeId }
      }
    })

    assert(
      !res.error,
      `Get recipe should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'RECIPE_FOUND',
      'Response should have RECIPE_FOUND code'
    )
    assert(res.data?.data.id === recipeId, 'Should return the correct recipe')
  })

  test('get non-existent recipe', async () => {
    const res = await client.GET('/foods/recipes/{id}', {
      params: {
        path: { id: ulid() }
      }
    })

    assert(res.error, 'Should return an error for non-existent recipe')
    assert(
      res.error?.code === 'ERR_RECIPE_NOT_FOUND',
      'Should return not found error'
    )
  })

  test('update recipe', async () => {
    const res = await client.PATCH('/foods/recipes/{id}', {
      params: {
        path: { id: recipeId }
      },
      body: {
        title: 'Updated Recipe'
      },
      bodySerializer
    })

    assert(
      !res.error,
      `Update recipe should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'RECIPE_UPDATED',
      'Response should have RECIPE_UPDATED code'
    )

    const findRecipeResult = await foodRecipeRepository.findById(recipeId)
    assert(findRecipeResult.isOk, 'Should be able to fetch recipe')
    assert(
      findRecipeResult.value?.title === 'Updated Recipe',
      'Should update the title'
    )
  })

  test('update non-existent recipe', async () => {
    const res = await client.PATCH('/foods/recipes/{id}', {
      params: {
        path: { id: ulid() }
      },
      body: {
        title: 'Updated Recipe'
      },
      bodySerializer
    })

    assert(res.error, 'Should return an error for non-existent recipe')
    assert(
      res.error?.code === 'ERR_RECIPE_NOT_FOUND',
      'Should return not found error'
    )
  })

  test('delete recipe', async () => {
    const res = await client.DELETE('/foods/recipes/{id}', {
      params: {
        path: { id: recipeId }
      }
    })

    assert(
      !res.error,
      `Delete recipe should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'RECIPE_DELETED',
      'Response should have RECIPE_DELETED code'
    )

    const findRecipeResult = await foodRecipeRepository.findById(recipeId)

    assert(findRecipeResult.isOk, 'Recipe should be deleted from database')
    assert(
      findRecipeResult.value === null,
      'Recipe should be deleted from database'
    )
  })

  test('delete non-existent recipe', async () => {
    const res = await client.DELETE('/foods/recipes/{id}', {
      params: {
        path: { id: ulid() }
      }
    })

    assert(res.error, 'Should return an error for non-existent recipe')
    assert(
      res.error?.code === 'ERR_RECIPE_NOT_FOUND',
      'Should return not found error'
    )
  })

  test('set store', async () => {
    const store = await getStore()

    await store.setStage('007', {
      recipe: {
        id: recipeId
      }
    })
  })
})
