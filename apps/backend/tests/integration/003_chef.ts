import { describe, test, before } from 'node:test'
import assert from 'node:assert'
import { client, useAuth, getStore, useApp, bodySerializer } from '../utils'
import { faker } from '@faker-js/faker'

const mockChefDetails = () => ({
  name: faker.person.fullName(),
  niches: faker.helpers.arrayElements(
    ['Italian', 'Mexican', 'Indian', 'Chinese', 'French'],
    { min: 0, max: 3 }
  )
})

describe('chef', async () => {
  const store = await getStore()

  const imageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
  const imageBuffer = Buffer.from(imageBase64, 'base64')
  const image = new File([imageBuffer], 'test.png', { type: 'image/png' })

  before(() => {
    assert(store.state.stage === '002', 'Should be in stage 002')
    useAuth(client, store.state.auth)
    useApp(client)
  })

  test('create chef profile', async () => {
    const res = await client.POST('/chefs', {
      body: mockChefDetails()
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
  })

  test('update chef profile', async () => {
    const res = await client.PATCH('/chefs/profile', {
      body: { ...mockChefDetails(), profile_picture: image },
      bodySerializer
    })

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
