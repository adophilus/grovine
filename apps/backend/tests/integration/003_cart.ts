import { describe, test, before } from 'node:test'
import assert from 'node:assert'
import { ulid } from 'ulidx'
import { client, bodySerializer, getStore, logger, useAuth } from '../utils'

describe('cart', async () => {
  const store = await getStore()

  const imageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
  const imageBuffer = Buffer.from(imageBase64, 'base64')
  const image = new File([imageBuffer], 'test.png', { type: 'image/png' })

  let itemId: string
  // just a simple change

  before(() => {
    assert(store.state.stage === '001', 'Should be in 001 stage')
    useAuth(client, store.state.auth)
  })

  test('setup: create item', async () => {
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

    await store.setStage('002', {
      ...store.state,
      item: {
        id: itemId
      }
    })
  })

  test('set item in cart', async () => {
    const res = await client.PUT('/foods/carts', {
      body: {
        id: itemId,
        quantity: 2
      }
    })

    assert(
      !res.error,
      `Set item in cart should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'ITEM_ADDED_TO_CART',
      'Response should have ITEM_ADDED_TO_CART code'
    )
  })

  test('set non-existent item in cart', async () => {
    const res = await client.PUT('/foods/carts', {
      body: {
        id: ulid(),
        quantity: 1
      }
    })

    assert(res.error, 'Should return an error for non-existent item')
    assert(
      res.error?.code === 'ERR_ITEM_NOT_FOUND',
      'Should return not found error'
    )
  })

  test('set item in cart with invalid quantity', async () => {
    const res = await client.PUT('/foods/carts', {
      body: {
        id: itemId,
        quantity: -1
      }
    })

    assert(res.error, 'Should return an error for invalid quantity')
    assert(
      res.error?.code === 'ERR_EXPECTED_DATA_NOT_RECEIVED',
      'Should return validation error'
    )
  })

  test('get cart', async () => {
    const res = await client.GET('/foods/carts')

    assert(
      !res.error,
      `Get cart should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'CART_FOUND',
      'Response should have CART_FOUND code'
    )
    assert(Array.isArray(res.data?.data.items), 'Cart should have items array')
    assert(res.data?.data.items.length > 0, 'Cart should have items')
    logger.debug(itemId)
    logger.debug(res.data.data.items)
    assert(
      res.data.data.items[0].items[0].id === itemId,
      'Cart should contain the added item'
    )
  })

  test.skip('checkout cart', async () => {
    const res = await client.POST('/foods/carts/checkout', {
      body: {
        delivery: {
          type: 'NOW',
          address: '123 Test Street',
          note_for_rider: 'Please deliver to the front door'
        },
        payment_method: 'ONLINE'
      }
    })

    assert(
      !res.error,
      `Checkout cart should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'CHECKOUT_SUCCESSFUL',
      'Response should have CHECKOUT_SUCCESSFUL code'
    )
    assert(res.data?.data.order_id, 'Response should have order_id')
    assert(
      res.data?.data.url,
      'Response should have payment URL for ONLINE payment'
    )
  })

  test.skip('checkout cart with scheduled delivery', async () => {
    // First add another item to cart
    await client.PUT('/foods/carts', {
      body: {
        id: itemId,
        quantity: 1
      }
    })

    const res = await client.POST('/foods/carts/checkout', {
      body: {
        delivery: {
          type: 'SCHEDULED',
          address: '123 Test Street',
          scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
        },
        payment_method: 'WALLET'
      }
    })

    assert(
      !res.error,
      `Checkout cart should not return an error: ${res.error?.code}`
    )
    assert(
      res.data?.code === 'CHECKOUT_SUCCESSFUL',
      'Response should have CHECKOUT_SUCCESSFUL code'
    )
    assert(res.data?.data.order_id, 'Response should have order_id')
    assert(
      !res.data?.data.url,
      'Response should not have payment URL for WALLET payment'
    )
  })

  test.skip('checkout empty cart', async () => {
    // First clear the cart by checking out
    await client.POST('/foods/carts/checkout', {
      body: {
        delivery: {
          type: 'NOW',
          address: '123 Test Street'
        },
        payment_method: 'ONLINE'
      }
    })

    const res = await client.POST('/foods/carts/checkout', {
      body: {
        delivery: {
          type: 'NOW',
          address: '123 Test Street'
        },
        payment_method: 'ONLINE'
      }
    })

    assert(res.error, 'Should return an error for empty cart')
    assert(
      res.error?.code === 'ERR_CART_EMPTY',
      'Should return empty cart error'
    )
  })

  // Cleanup: delete the test item
  test.skip('cleanup: delete item', async () => {
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
  })
})
