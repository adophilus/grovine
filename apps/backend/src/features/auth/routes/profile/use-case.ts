import type { User } from "@/types";
import type { Response } from "./types";
import { Result } from "true-myth";

class GetUserProfileUseCase {
	async execute(
		user: User.Selectable,
	): Promise<Result<Response.Success, Response.Error>> {
		return Result.ok({ code: "USER_PROFILE", data: user });
	}
}

export default GetUserProfileUseCase;
