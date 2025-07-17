import { Hono } from "hono";
import CartSetItemRoute from "./set-item";
import GetCartRoute from "./get";
import CheckoutCartRoute from "./checkout";

const FoodCartRouter = new Hono()
	.route("/", CartSetItemRoute)
	.route("/", GetCartRoute)
	.route("/checkout", CheckoutCartRoute);

export default FoodCartRouter;
