import { Hono } from "hono";
import { CreateAdvertRoute } from "./create";
import { ListAdvertRoute } from "./list";
import { UpdateAdvertRoute } from "./update";
import { DeleteAdvertRoute } from "./delete";

const advertRouter = new Hono()
	.route("/", CreateAdvertRoute)
	.route("/", ListAdvertRoute)
	.route("/", UpdateAdvertRoute)
	.route("/", DeleteAdvertRoute);

export default advertRouter;
