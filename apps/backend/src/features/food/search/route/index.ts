import { Hono } from 'hono'
import SearchFoodRoute from './search'

const FoodSearchRouter = new Hono().route('/', SearchFoodRoute)

export default FoodSearchRouter
