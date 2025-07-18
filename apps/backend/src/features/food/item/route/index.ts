import { Hono } from "hono";
import CreateFoodItemRoute from "./create";
import ListFoodItemsRoute from "./list";
import update from "./update";
import del from "./delete";
import GetFoodItemRoute from "./get";

export default new Hono()
	.route("/", CreateFoodItemRoute)
	.route("/", ListFoodItemsRoute)
	.route("/", GetFoodItemRoute)
	.route("/", update)
	.route("/", del);
