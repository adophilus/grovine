import type Repository from './repository'

export type SerializedOrderWithItems = Omit<
  Repository.OrderWithItems,
  'price' | 'items'
> & {
  price: number
  items: (Omit<Repository.OrderWithItems['items'][number], 'price'> & {
    price: number
  })[]
}

export const serializeOrderWithItems = (
  order: Repository.OrderWithItems
): SerializedOrderWithItems => {
  return {
    ...order,
    price: Number.parseFloat(order.price),
    items: order.items.map((item) => ({
      ...item,
      price: Number.parseFloat(item.price)
    }))
  }
}
