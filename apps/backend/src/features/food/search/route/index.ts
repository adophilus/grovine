import { Hono } from 'hono'
import SearchFoodItemsRoute from './search'

const FoodSearchRouter = new Hono().route('/', SearchFoodItemsRoute)

export default FoodSearchRouter
