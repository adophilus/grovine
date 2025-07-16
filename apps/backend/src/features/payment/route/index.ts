import { Hono } from "hono";
import webhookRouter from "./webhook";

const PaymentRouter = new Hono().route("/webhook", webhookRouter);

export default PaymentRouter;
