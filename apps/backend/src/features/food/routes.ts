import { Hono } from 'hono'
import { recipeRouter } from './recipe'

export default new Hono().route('/recipes', recipeRouter)
