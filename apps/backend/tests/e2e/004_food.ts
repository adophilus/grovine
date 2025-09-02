import { assert, beforeAll, afterAll, describe, test } from 'vitest'
import { ulid } from 'ulidx'
import { client, bodySerializer, getStore } from '../utils'
import { FoodItemRepository } from '@/features/food/item/repository'
import { Container } from '@n8n/di'

describe('food items', async () => {
  const store = await getStore()

  assert(store.state.stage === '003', 'Invalid stage')

  const userId = store.state.user.id

  const foodItemRepository = Container.get(FoodItemRepository)

  const imageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
  const imageBuffer = Buffer.from(imageBase64, 'base64')
  const image = new File([imageBuffer], 'test.png', { type: 'image/png' })
  let itemId: string

  beforeAll(async () => {
    const res = await client.PATCH('/dev/users/{id}', {
      params: {
        path: {
          id: userId
        }
      },
      body: {
        role: 'ADMIN'
      }
    })

    assert(!res.error, 'Request should not return an error')
  })

  // afterAll(async () => {
  //   const res = await client.PATCH('/dev/users/{id}', {
  //     params: {
  //       path: {
  //         id: userId
  //       }
  //     },
  //     body: {
  //       role: 'CHEF'
  //     }
  //   })
  //
  //   assert(!res.error, 'Request should not return an error')
  // })

  test('create item', async () => {
    const res = await client.POST('/foods/items', {
      body: {
        name: 'Test Item',
        video_url: 'https://example.com/video.mp4',
        price: 1000,
        image
      },
      bodySerializer
    })

    assert(
      !res.error,
      `Create item should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'ITEM_CREATED',
      'Response should have ITEM_CREATED code'
    )

    itemId = res.data.data.id
  })

  test('create item with invalid data', async () => {
    const res = await client.POST('/foods/items', {
      body: {
        name: 'Test Item',
        video_url: 'invalid-url',
        price: -100,
        image
      },
      bodySerializer
    })

    assert(res.error, 'Should return an error for invalid data')
    assert(
      res.error?.code === 'ERR_EXPECTED_DATA_NOT_RECEIVED',
      'Should return validation error'
    )
  })

  test('get item', async () => {
    const res = await client.GET('/foods/items/{id}', {
      params: {
        path: { id: itemId }
      }
    })

    assert(
      !res.error,
      `Get item should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'ITEM_FOUND',
      'Response should have ITEM_FOUND code'
    )
    assert(res.data?.data.id === itemId, 'Should return the correct item')
  })

  test('get non-existent item', async () => {
    const res = await client.GET('/foods/items/{id}', {
      params: {
        path: { id: ulid() }
      }
    })

    assert(res.error, 'Should return an error for non-existent item')
    assert(
      res.error?.code === 'ERR_ITEM_NOT_FOUND',
      'Should return not found error'
    )
  })

  test('update item', async () => {
    const res = await client.PATCH('/foods/items/{id}', {
      params: {
        path: { id: itemId }
      },
      body: {
        name: 'Updated Item',
        price: 2000,
        image
      },
      bodySerializer
    })

    assert(
      !res.error,
      `Update item should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'ITEM_UPDATED',
      'Response should have ITEM_UPDATED code'
    )
    assert(res.data?.data.name === 'Updated Item', 'Should update the name')
    assert(res.data?.data.price === 2000, 'Should update the price')
  })

  test('update non-existent item', async () => {
    const res = await client.PATCH('/foods/items/{id}', {
      params: {
        path: { id: ulid() }
      },
      body: {
        name: 'Updated Item'
      },
      bodySerializer
    })

    assert(res.error, 'Should return an error for non-existent item')
    assert(
      res.error?.code === 'ERR_ITEM_NOT_FOUND',
      'Should return not found error'
    )
  })

  test('delete item', async () => {
    const res = await client.DELETE('/foods/items/{id}', {
      params: {
        path: { id: itemId }
      }
    })

    assert(
      !res.error,
      `Delete item should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'ITEM_DELETED',
      'Response should have ITEM_DELETED code'
    )

    const findItemResult = await foodItemRepository.findById(itemId)

    assert(findItemResult.isOk, 'Item should be deleted from database')
    assert(
      findItemResult.value === null,
      'Item should be deleted from database'
    )
  })

  test('delete non-existent item', async () => {
    const res = await client.DELETE('/foods/items/{id}', {
      params: {
        path: { id: ulid() }
      }
    })

    assert(res.error, 'Should return an error for non-existent item')
    assert(
      res.error?.code === 'ERR_ITEM_NOT_FOUND',
      'Should return not found error'
    )
  })
})
