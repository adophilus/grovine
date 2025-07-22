import { describe, test, before } from 'node:test'
import assert from 'node:assert'
import { client, useAuth, getStore, useApp } from '../utils'

describe('order', async () => {
  const store = await getStore()
  let orderId: string

  before(() => {
    assert(store.state.stage === '005', 'Should be in 005 stage')

    useAuth(client, store.state.auth)
    useApp(client)

    orderId = store.state.order.id
  })

  test('list ongoing orders', async () => {
    const res = await client.GET('/foods/orders', {
      params: {
        query: {
          status: 'ONGOING'
        }
      }
    })

    assert(!res.error, `List orders should not return an error: ${res.error}`)
    assert(res.data.code === 'LIST', 'Response should have LIST code')
    assert(Array.isArray(res.data.data), 'Response data should be an array')
    assert(
      res.data.data.some((order) => order.id === orderId),
      'Response should contain the created order'
    )
  })

  test('list completed orders', async () => {
    const res = await client.GET('/foods/orders', {
      params: {
        query: {
          status: 'COMPLETED'
        }
      }
    })

    assert(!res.error, `List orders should not return an error: ${res.error}`)
    assert(res.data.code === 'LIST', 'Response should have LIST code')
    assert(Array.isArray(res.data.data), 'Response data should be an array')
  })

  test('list cancelled orders', async () => {
    const res = await client.GET('/foods/orders', {
      params: {
        query: {
          status: 'CANCELLED'
        }
      }
    })

    assert(!res.error, `List orders should not return an error: ${res.error}`)
    assert(res.data.code === 'LIST', 'Response should have LIST code')
    assert(Array.isArray(res.data.data), 'Response data should be an array')
  })

  test('get order by id', async () => {
    const res = await client.GET('/foods/orders/{id}', {
      params: {
        path: {
          id: orderId
        }
      }
    })

    assert(!res.error, `Get order should not return an error: ${res.error}`)
    assert(
      res.data.code === 'ORDER_FOUND',
      'Response should have ORDER_FOUND code'
    )
    assert(res.data.data.id === orderId, 'Response should have the correct id')
  })

  test('update order status', async () => {
    const res = await client.PUT('/foods/orders/{id}', {
      params: {
        path: {
          id: orderId
        }
      },
      body: {
        status: 'DELIVERED'
      }
    })

    assert(
      !res.error,
      `Update order status should not return an error: ${res.error}`
    )
    assert(
      res.data.code === 'ORDER_STATUS_UPDATED',
      'Response should have ORDER_STATUS_UPDATED code'
    )
  })
})
