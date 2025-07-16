import { Hono } from "hono";
import VerifySignUpVerificationEmailRoute from "./verify";
import ResendSignUpVerificationEmailRoute from "./resend";

const SignUpVerificationRoute = new Hono()
	.route("/", VerifySignUpVerificationEmailRoute)
	.route("/resend", ResendSignUpVerificationEmailRoute);

export default SignUpVerificationRoute;
