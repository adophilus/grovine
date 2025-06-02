import type { MiddlewareHandler } from "hono";
import type { User } from "@/types";
import { StatusCodes } from "../http";
import type { types } from "@grovine/api";
import Repository from "./repository";
import { verifyToken } from "./utils/token";

export type Response =
	| types.components["schemas"]["Api.UnauthorizedError"]
	| types.components["schemas"]["Api.UserNotVerifiedError"]
	| types.components["schemas"]["Api.UnexpectedError"];

namespace Middleware {
	export const middleware: MiddlewareHandler<{
		Variables: {
			user: User.Selectable;
		};
	}> = async (c, next) => {
		let response: Response;

		const authHeader = c.req.header("authorization");
		if (!authHeader) {
			response = {
				code: "ERR_UNAUTHORIZED",
			};
			return c.json(response, StatusCodes.UNAUTHORIZED);
		}

		const [, accessToken] = authHeader.split(" ");
		if (!accessToken) {
			response = {
				code: "ERR_UNAUTHORIZED",
			};
			return c.json(response, StatusCodes.UNAUTHORIZED);
		}

		const tokenVerificationResult = await verifyToken(accessToken);
		if (tokenVerificationResult.isErr) {
			response = {
				code: "ERR_UNAUTHORIZED",
			};
			return c.json(response, StatusCodes.UNAUTHORIZED);
		}

		const findUserResult = await Repository.findUserById({
			id: tokenVerificationResult.value.id,
		});

		if (findUserResult.isErr) {
			response = {
				code: "ERR_UNEXPECTED",
			};
			return c.json(response, StatusCodes.UNAUTHORIZED);
		}

		const user = findUserResult.value;

		if (!user) {
			response = {
				code: "ERR_UNAUTHORIZED",
			};
			return c.json(response, StatusCodes.UNAUTHORIZED);
		}

		if (user.verified_at === null) {
			response = {
				code: "ERR_USER_NOT_VERIFIED",
			};
			return c.json(response, StatusCodes.UNAUTHORIZED);
		}

		c.set("user", user);

		await next();
	};
}

export default Middleware;
