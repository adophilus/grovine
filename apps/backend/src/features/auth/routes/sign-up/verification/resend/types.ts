import type { z } from "zod";
import { schema as apiSchema, types } from "@grovine/api";

export namespace Request {
	export const body =
		apiSchema.schemas.Api_Authentication_SignUp_SignUp_Request_Body;

	export type Body = z.infer<typeof body>;
}

export namespace Response {
	export type Response =
		types.paths["/api/auth/sign-up/"]["post"]["responses"][keyof types.paths["/api/auth/sign-up/"]["post"]["responses"]]["content"]["application/json"];
}
