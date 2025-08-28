import { assert, describe, test, beforeAll, afterAll } from 'vitest'
import { client, bodySerializer } from '../utils'
import { FoodItemRepository } from '@/features/food/item/repository'
import { Container } from '@n8n/di'

describe('search food items', async () => {
  const foodItemRepository = Container.get(FoodItemRepository)

  const imageBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII'
  const imageBuffer = Buffer.from(imageBase64, 'base64')
  const image = new File([imageBuffer], 'test.png', { type: 'image/png' })

  let item1Id: string
  let item2Id: string
  let item3Id: string

  beforeAll(async () => {
    const res1 = await client.POST('/foods/items', {
      body: {
        name: 'Spicy Chicken Noodles',
        video_url: 'https://example.com/video1.mp4',
        price: 1500,
        image
      },
      bodySerializer
    })
    assert(!res1.error, `Failed to create item 1: ${res1.error?.code}`)
    item1Id = res1.data.data.id

    const res2 = await client.POST('/foods/items', {
      body: {
        name: 'Vegetable Stir Fry',
        video_url: 'https://example.com/video2.mp4',
        price: 1200,
        image
      },
      bodySerializer
    })
    assert(!res2.error, `Failed to create item 2: ${res2.error?.code}`)
    item2Id = res2.data.data.id

    const res3 = await client.POST('/foods/items', {
      body: {
        name: 'Chicken Curry',
        video_url: 'https://example.com/video3.mp4',
        price: 1800,
        image
      },
      bodySerializer
    })
    assert(!res3.error, `Failed to create item 3: ${res3.error?.code}`)
    item3Id = res3.data.data.id
  })

  afterAll(async () => {
    const deleteRes1 = await foodItemRepository.deleteById(item1Id)
    assert(deleteRes1.isOk, 'Failed to delete item 1')

    const deleteRes2 = await foodItemRepository.deleteById(item2Id)
    assert(deleteRes2.isOk, 'Failed to delete item 2')

    const deleteRes3 = await foodItemRepository.deleteById(item3Id)
    assert(deleteRes3.isOk, 'Failed to delete item 3:')
  })

  test('search by name returns correct items', async () => {
    const res = await client.GET('/foods/search', {
      query: {
        q: 'chicken',
        page: 1,
        per_page: 10
      }
    })

    assert(!res.error, `Search should not return an error: ${res.error?.code}`)
    assert(res.data?.code === 'LIST', 'Response should have LIST code')
    assert(res.data?.data.data.length === 2, 'Should return 2 items')
    assert(
      res.data?.data.data.some((item) => item.id === item1Id),
      'Should contain Spicy Chicken Noodles'
    )
    assert(
      res.data?.data.data.some((item) => item.id === item3Id),
      'Should contain Chicken Curry'
    )
    assert(res.data?.data.meta.total === 2, 'Total should be 2')
  })

  test('search by non-existent name returns empty list', async () => {
    const res = await client.GET('/foods/search', {
      query: {
        q: 'nonexistentfood',
        page: 1,
        per_page: 10
      }
    })

    assert(!res.error, `Search should not return an error: ${res.error?.code}`)
    assert(res.data?.code === 'LIST', 'Response should have LIST code')
    assert(res.data?.data.data.length === 0, 'Should return 0 items')
    assert(res.data?.data.meta.total === 0, 'Total should be 0')
  })
})
