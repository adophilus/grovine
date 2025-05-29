import { Hono } from "hono";
// import signInRouter from "./sign-in";
import signUpRouter from "./sign-up";
// import authProfileRouter from "./profile";

export default new Hono()
	// .route("/sign-in", signInRouter)
	.route("/sign-up", signUpRouter);
// .route("/", authProfileRouter);
