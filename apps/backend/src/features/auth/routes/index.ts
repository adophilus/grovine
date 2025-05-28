import { Hono } from "hono";
import signInRouter from "./sign-in";
import signUpRouter from "./sign-up";
import sendVerificationEmailRouter from "./send-verification-email";
import verifyEmailRouter from "./verify-email";
import resetPasswordRouter from "./reset-password";
import authProfileRouter from "./profile";

export default new Hono()
	.route("/", signInRouter)
	.route("/sign-up", signUpRouter)
	.route("/", sendVerificationEmailRouter)
	.route("/", verifyEmailRouter)
	.route("/", resetPasswordRouter)
	.route("/", authProfileRouter);
