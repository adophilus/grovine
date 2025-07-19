import type { OrderWithItems } from './repository/interface'

export type SerializedOrderWithItems = Omit<
  OrderWithItems,
  'price' | 'items'
> & {
  price: number
  items: (Omit<OrderWithItems['items'][number], 'price'> & {
    price: number
  })[]
}

export const serializeOrderWithItems = (
  order: OrderWithItems
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
