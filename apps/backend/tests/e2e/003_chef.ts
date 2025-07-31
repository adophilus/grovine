import { describe, test, assert } from 'vitest'
import { client, getStore, bodySerializer } from '../utils'
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
    store.setStage('003', {
      chef: {}
    })
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
  })

  test('update chef profile', async () => {
    const res = await client.PATCH('/chefs/profile', {
      body: { ...mockChefDetails(userFullName), profile_picture: image },
      bodySerializer
    })

    console.log(JSON.stringify(res.data))
    console.log(JSON.stringify(res.error))

    assert(
      !res.error,
      `Update chef profile should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'CHEF_PROFILE_UPDATED',
      'Response should have CHEF_PROFILE_UPDATED code'
    )
  })
})
