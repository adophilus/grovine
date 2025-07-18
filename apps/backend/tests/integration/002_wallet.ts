import { describe, test, before } from 'node:test'
import assert from 'node:assert'
import { app, client, getStoreAtStage, useApp, useAuth } from '../utils'

describe('wallet', async () => {
  const store = await getStoreAtStage('001')
  const accessToken = store.state.auth.access_token

  before(async () => {
    useAuth(client, store.state.auth)
    useApp(client)
  })

  test('get user wallet', async () => {
    const res = await client.GET('/wallets', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

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
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
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
