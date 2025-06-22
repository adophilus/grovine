import { z } from 'zod'
import assert from 'node:assert'
import { getTestCache, setTestCache } from './test-cache'

const storeStage000 = z.object({
  stage: z.literal('000')
})

const storeStage001 = z.object({
  stage: z.literal('001'),
  auth: z.object({
    access_token: z.string(),
    refresh_token: z.string()
  }),
  user: z.object({
    email: z.string().email()
  })
})

const storeStage002 = z.object({
  stage: z.literal('002'),
  item: z.object({
    id: z.string()
  })
})

type TStoreStage000 = z.infer<typeof storeStage000>
type TStoreStage001 = z.infer<typeof storeStage001>
type TStoreStage002 = z.infer<typeof storeStage002>

type TStoreStage = TStoreStage000 | TStoreStage001 | TStoreStage002

export const storeSchema = z.discriminatedUnion('stage', [
  storeStage000,
  storeStage001.extend(storeStage000.omit({ stage: true }).shape),
  storeStage002.extend(storeStage001.omit({ stage: true }).shape)
])

export type TStoreState = z.infer<typeof storeSchema>
export type TStore = Awaited<ReturnType<typeof getStore>>

function precursorStage<Stage extends TStoreStage['stage']>(
  stage: Stage
): Stage extends '000'
  ? '000'
  : Stage extends '001'
    ? '000'
    : Stage extends '002'
      ? '001'
      : never

function precursorStage(stage: unknown): unknown {
  switch (stage) {
    case '000':
      return '000'
    case '001':
      return '000'
    case '002':
      return '001'
    default:
      throw new Error(`Invalid stage: ${stage}`)
  }
}

export const getStore = async () => {
  const cachedState = await getTestCache()

  const store = {
    state: cachedState ?? {
      stage: '000'
    },
    async setStage<
      Stage extends TStoreStage['stage'],
      State extends Omit<Extract<TStoreStage, { stage: Stage }>, 'stage'>
    >(stage: Stage, state: State) {
      assert(
        this.state.stage === precursorStage(stage),
        'Invalid stage transition'
      )

      const newState = {
        ...this.state,
        ...state,
        stage
      }

      storeSchema.parse(newState)
      this.state = newState
      await setTestCache(newState)
    }
  }

  return store
}
