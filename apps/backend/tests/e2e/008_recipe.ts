import { describe, test, assert } from 'vitest'
import { client, getStore, bodySerializer } from '../utils/index.js'
import { faker } from '@faker-js/faker'

const mockRecipeDetails = () => ({
  title: faker.lorem.words(3),
  description: faker.lorem.paragraph(),
  ingredients: [{ id: faker.lorem.word(), quantity: faker.number.int({ min: 1, max: 10 }) }],
  instructions: [{ title: faker.lorem.words(2), content: faker.lorem.paragraph() }],
  video: new File([], 'test.mp4', { type: 'video/mp4' }),
  cover_image: new File([], 'test.png', { type: 'image/png' })
})

describe('recipe likes and ratings', async () => {
  const store = await getStore()
  assert(store.state.stage === '007', 'Should be in stage 007')

  let recipeId: string
  const recipeRating = faker.number.int({ min: 1, max: 5 })
  const updatedRecipeRating = faker.number.int({ min: 1, max: 5 })

  test('create recipe', async () => {
    const res = await client.POST('/foods/recipes', {
      body: mockRecipeDetails(),
      bodySerializer
    })

    assert(
      !res.error,
      `Create recipe should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'RECIPE_CREATED',
      'Response should have RECIPE_CREATED code'
    )
    recipeId = res.data.data.id
  })

  test('like recipe', async () => {
    const res = await client.PUT(`/foods/recipes/${recipeId}/like`)

    assert(
      !res.error,
      `Like recipe should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'RECIPE_LIKED',
      'Response should have RECIPE_LIKED code'
    )

    const recipeRes = await client.GET(`/foods/recipes/${recipeId}`)
    assert(recipeRes.data.data.likes === 1, 'Recipe should have 1 like')
    assert(recipeRes.data.data.dislikes === 0, 'Recipe should have 0 dislikes')
  })

  test('dislike recipe', async () => {
    const res = await client.PUT(`/foods/recipes/${recipeId}/dislike`)

    assert(
      !res.error,
      `Dislike recipe should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'RECIPE_DISLIKED',
      'Response should have RECIPE_DISLIKED code'
    )

    const recipeRes = await client.GET(`/foods/recipes/${recipeId}`)
    assert(recipeRes.data.data.likes === 0, 'Recipe should have 0 likes')
    assert(recipeRes.data.data.dislikes === 1, 'Recipe should have 1 dislike')
  })

  test('rate recipe', async () => {
    const res = await client.PUT(`/foods/recipes/${recipeId}/rate`, {
      json: { rating: recipeRating }
    })

    assert(
      !res.error,
      `Rate recipe should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'RECIPE_RATED',
      'Response should have RECIPE_RATED code'
    )

    const recipeRes = await client.GET(`/foods/recipes/${recipeId}`)
    assert(recipeRes.data.data.rating === recipeRating, `Recipe should have a rating of ${recipeRating}`)
  })

  test('update recipe rating', async () => {
    const res = await client.PUT(`/foods/recipes/${recipeId}/rate`, {
      json: { rating: updatedRecipeRating }
    })

    assert(
      !res.error,
      `Update recipe rating should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'RECIPE_RATED',
      'Response should have RECIPE_RATED code'
    )

    const recipeRes = await client.GET(`/foods/recipes/${recipeId}`)
    assert(recipeRes.data.data.rating === updatedRecipeRating, `Recipe should have an updated rating of ${updatedRecipeRating}`)
  })
})
