import { assert, describe, test } from 'vitest'
import { app, client, getStoreAtStage } from '../utils'

describe('wallet', async () => {
  const store = await getStoreAtStage('001')

  test('get user wallet', async () => {
    const res = await client.GET('/wallets')

    assert(
      !res.error,
      `Get wallet should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'WALLET_FOUND',
      'Response should have WALLET_FOUND code'
    )
  })

  test('topup wallet', async () => {
    const res = await client.POST('/wallets/topup', {
      body: {
        amount: 1000
      }
    })

    assert(
      !res.error,
      `Wallet topup should not return an error: ${res.error?.code}`
    )
    assert(
      res.data.code === 'WALLET_TOPUP_REQUEST_SUCCESSFUL',
      'Response should have WALLET_TOPUP_REQUEST_SUCCESSFUL code'
    )

    await app.request(res.data.data.url, { method: 'POST' })

    await store.setStage('002', {})
  })
})
