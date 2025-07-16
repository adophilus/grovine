import { Hono } from "hono";
// import { onboardingRouter } from "./features/onboarding";
// import { foodRouter } from "./features/food";
import AdvertRouter from "@/features/advert/route";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { Logger } from "@/features/logger";
import { StatusCodes } from "@/features/http";
import AuthRouter from "@/features/auth/routes";
import type App from "./interface";
// import { walletRouter } from "./features/wallets";
// import { paymentRouter } from "./features/payment";

class HonoApp implements App {
	constructor(private logger: Logger) {}

	create() {
		const apiRoutes = new Hono()
			.route("/auth", AuthRouter)
			.route("/ads", AdvertRouter);
		// .route("/onboarding", onboardingRouter)
		// .route("/foods", foodRouter)
		// .route("/wallets", walletRouter)
		// .route("/payment", paymentRouter);

		return new Hono()
			.use(compress())
			.use(cors())
			.use(honoLogger())
			.route("/", apiRoutes)
			.notFound((c) => c.json({ error: "NOT_FOUND" }, StatusCodes.NOT_FOUND))
			.onError((err, c) => {
				this.logger.error("An unexpected error occurred:", err);
				return c.json(
					{ code: "ERR_UNEXPECTED" },
					StatusCodes.INTERNAL_SERVER_ERROR,
				);
			});
	}
}

export default HonoApp;
