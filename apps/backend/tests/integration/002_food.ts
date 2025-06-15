import { describe, test } from 'node:test'
import assert from 'node:assert'
import { db } from '@/features/database'
import { ulid } from 'ulidx'
import { store, client } from '../setup'
import { ItemRepository } from '@/features/food/items'

describe('food items', () => {
  let itemId: string

  test('create item', async () => {
    const res = await client.POST('/foods/items', {
      body: {
        name: 'Test Item',
        video_url: 'https://example.com/video.mp4',
        price: 1000,
        image: 'dummy-image-string'
      },
      headers: {
        'content-type': 'multipart/form-data'
      }
    })

    assert(
      !res.error,
      `Create item should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'ITEM_CREATED',
      'Response should have ITEM_CREATED code'
    )
  })

  test('create item with invalid data', async () => {
    const res = await client.POST('/foods/items', {
      body: {
        name: 'Test Item',
        video_url: 'invalid-url',
        price: -100,
        image: 'dummy-image-string'
      },
      headers: {
        'content-type': 'multipart/form-data'
      }
    })

    assert(res.error, 'Should return an error for invalid data')
    assert(
      res.error?.code === 'ERR_EXPECTED_DATA_NOT_RECEIVED',
      'Should return validation error'
    )
  })

  test('get item', async () => {
    // Create a test item first
    const image = {
      public_id: 'test',
      url: 'https://example.com/test.jpg'
    }

    const [item] = await db
      .insertInto('food_items')
      .values({
        id: ulid(),
        name: 'Test Item',
        video_url: 'https://example.com/video.mp4',
        price: '1000',
        image
      })
      .returning('id')
      .execute()

    itemId = item.id

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
        price: 2000
      },
      headers: {
        'content-type': 'multipart/form-data'
      }
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
      headers: {
        'content-type': 'multipart/form-data'
      }
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

    const findItemResult = await ItemRepository.findItemById(itemId)

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
