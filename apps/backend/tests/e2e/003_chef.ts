import { describe, test, assert } from 'vitest'
import { client, getStore, bodySerializer } from '../utils/index.js'
import { faker } from '@faker-js/faker'

const mockChefDetails = (fullName: string) => ({
  name: fullName,
  niches: faker.helpers.arrayElements(
    ['Italian', 'Mexican', 'Indian', 'Chinese', 'French'],
    { min: 0, max: 5 }
  )
})

describe('chef', async () => {
  const store = await getStore()
  assert(store.state.stage === '002', 'Should be in stage 002')
  const userFullName = store.state.user.full_name

  const imageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
  const imageBuffer = Buffer.from(imageBase64, 'base64')
  const image = new File([imageBuffer], 'test.png', { type: 'image/png' })

  const chefRating = faker.number.int({ min: 1, max: 5 })
  const updatedChefRating = faker.number.int({ min: 1, max: 5 })
  let chefId: string

  test('create chef profile', async () => {
    const res = await client.POST('/chefs', {
      body: mockChefDetails(userFullName)
    })

    assert(
      !res.error,
      `Create chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_CREATED',
      'Response should have CHEF_PROFILE_CREATED code'
    )
  })

  test('get chef profile', async () => {
    const res = await client.GET('/chefs/profile')

    assert(
      !res.error,
      `Get chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_FOUND',
      'Response should have CHEF_PROFILE_FOUND code'
    )
    chefId = res.data.data.id
    store.setStage('003', {
      chef: res.data.data
    })
  })

  test('update chef profile', async () => {
    const res = await client.PATCH('/chefs/profile', {
      body: { ...mockChefDetails(userFullName), profile_picture: image },
      bodySerializer
    })

    console.log('res.error:', JSON.stringify(res.error))
    console.log('res.data:', JSON.stringify(res.data))

    assert(
      !res.error,
      `Update chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_UPDATED',
      'Response should have CHEF_PROFILE_UPDATED code'
    )
  })

  test('like chef profile', async () => {
    const res = await client.PUT('/chefs/{id}/like', {
      params: {
        path: {
          id: chefId
        }
      }
    })

    assert(
      !res.error,
      `Like chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_LIKED',
      'Response should have CHEF_PROFILE_LIKED code'
    )
  })

  test('chef profile should have 1 like and 0 dislikes', async () => {
    const res = await client.GET('/chefs/{id}', {
      params: { path: { id: chefId } }
    })

    assert(
      !res.error,
      `Get chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_FOUND',
      'Response should have CHEF_PROFILE_FOUND code'
    )
    assert(res.data.data.likes === 1, 'Chef should have 1 like')
    assert(res.data.data.dislikes === 0, 'Chef should have 0 dislikes')
  })

  test('dislike chef profile', async () => {
    const res = await client.PUT('/chefs/{id}/dislike', {
      params: { path: { id: chefId } }
    })

    assert(
      !res.error,
      `Dislike chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_DISLIKED',
      'Response should have CHEF_PROFILE_DISLIKED code'
    )
    assert(
      res.data.code === 'CHEF_PROFILE_DISLIKED',
      'Response should have CHEF_PROFILE_DISLIKED code'
    )
  })

  test('chef profile should have 1 dislike and 0 likes', async () => {
    const chefRes = await client.GET('/chefs/{id}', {
      params: { path: { id: chefId } }
    })

    assert(
      !chefRes.error,
      `Get chef profile should not return an error: ${chefRes.error?.code}`
    )
    assert(chefRes.data.data.likes === 0, 'Chef should have 0 likes')
    assert(chefRes.data.data.dislikes === 1, 'Chef should have 1 dislike')
  })

  test('rate chef profile', async () => {
    const res = await client.PUT('/chefs/{id}/rate', {
      params: { path: { id: chefId } },
      body: { rating: chefRating }
    })

    assert(
      !res.error,
      `Rate chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_RATED',
      'Response should have CHEF_PROFILE_RATED code'
    )
  })

  test(`chef profile should have a rating of ${chefRating}`, async () => {
    const res = await client.GET('/chefs/{id}', {
      params: { path: { id: chefId } }
    })

    assert(
      !res.error,
      `Get chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.data.rating === chefRating,
      `Chef should have a rating of ${chefRating}`
    )
  })

  test('update rating', async () => {
    const res = await client.PUT('/chefs/{id}/rate', {
      params: { path: { id: chefId } },
      body: { rating: updatedChefRating }
    })

    assert(
      !res.error,
      `Update rating should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_RATED',
      'Response should have CHEF_PROFILE_RATED code'
    )
  })

  test('chef profile should have updated rating', async () => {
    const res = await client.GET('/chefs/{id}', {
      params: { path: { id: chefId } }
    })

    assert(
      !res.error,
      `Get chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_FOUND',
      'Response should have CHEF_PROFILE_FOUND code'
    )
    assert(
      res.data.data.rating === updatedChefRating,
      'Chef should have a rating of 3'
    )
  })
})
