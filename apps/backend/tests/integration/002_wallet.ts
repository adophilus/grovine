import { describe, test, afterEach } from 'node:test'
import assert from 'node:assert'
import { client, getStoreAtStage, sleep } from '../utils'

describe('wallet', async () => {
  afterEach(async () => sleep(60 * 1000))

  const store = await getStoreAtStage('001')

  const accessToken = store.state.auth.access_token

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

    console.log('Topup url:', res.data.data.url)
  })
})
