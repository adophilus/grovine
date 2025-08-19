import type { FoodItem } from '@/types'

export const serializeItem = (item: FoodItem.Selectable) => {
  return {
    ...item,
    price: Number.parseFloat(item.price)
  }
}
