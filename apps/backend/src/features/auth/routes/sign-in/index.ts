import { Hono } from "hono";
import sendVerificationMail from "./send-verification-mail";
import verification from "./verification";

export default new Hono()
	.route("/", sendVerificationMail)
	.route("/verification", verification);
