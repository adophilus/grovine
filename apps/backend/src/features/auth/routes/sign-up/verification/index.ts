import { Hono } from "hono";
import verify from "./verify";
import resend from "./resend";

export default new Hono().route("/", verify).route("/resend", resend);
