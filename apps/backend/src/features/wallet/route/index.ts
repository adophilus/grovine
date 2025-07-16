import { Hono } from "hono";
import GetWalletRoute from "./get";
import TopupWalletRoute from "./topup";
import WithdrawWalletRoute from "./withdraw";

const WalletRouter = new Hono()
	.route("/", GetWalletRoute)
	.route("/topup", TopupWalletRoute)
	.route("/withdraw", WithdrawWalletRoute);

export default WalletRouter;
