import type { Item } from '@/types'

export const serializeItem = (item: Item.Selectable) => {
  return {
    ...item,
    price: Number.parseFloat(item.price)
  }
}
