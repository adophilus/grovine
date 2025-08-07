import type { Chef } from '@/types'

export type SerializedChef = Omit<
  Chef.Selectable,
  'rating' | 'likes' | 'dislikes'
> & {
  rating: number
  likes: number
  dislikes: number
}

export const serializeChef = (chef: Chef.Selectable): SerializedChef => ({
  ...chef,
  rating: Number(chef.rating),
  likes: Number(chef.likes),
  dislikes: Number(chef.dislikes)
})
