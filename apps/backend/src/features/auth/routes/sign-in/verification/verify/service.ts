import { Result } from "true-myth";
import Repository from "../../../../repository";
import { SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY, type User } from "@/types";
import type { Request, Response } from "./types";
import { Mailer } from "@/features/mailer";
import VerificationSuccessful from "./mail/verification-successful";
import { compareAsc } from "date-fns";
import { generateTokens } from "@/features/auth/utils/token";

export type Payload = Request.Body;

export default async (
	payload: Payload,
): Promise<Result<Response.Success, Response.Error>> => {
	const existingUserResult = await Repository.findUserByEmail(payload.email);
	if (existingUserResult.isErr) {
		return Result.err({
			code: "ERR_UNEXPECTED",
		});
	}

	const existingUser = existingUserResult.value;
	if (!existingUser) {
		return Result.err({
			code: "ERR_INVALID_OR_EXPIRED_TOKEN",
		});
	}

	const existingTokenResult = await Repository.findTokenByUserIdAndPurpose({
		purpose: SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY,
		user_id: existingUser.id,
	});

	if (existingTokenResult.isErr) {
		return Result.err({
			code: "ERR_UNEXPECTED",
		});
	}

	const existingToken = existingTokenResult.value;

	if (
		!existingToken ||
		existingToken.token !== payload.otp ||
		compareAsc(Date.now(), existingToken.expires_at) === 1
	) {
		return Result.err({
			code: "ERR_INVALID_OR_EXPIRED_TOKEN",
		});
	}

	const userUpdateResult = await Repository.updateUserById(existingUser.id, {
		verified_at: Date.now(),
	});

	if (userUpdateResult.isErr) {
		return Result.err({
			code: "ERR_UNEXPECTED",
		});
	}

	const user = userUpdateResult.value;

	await Mailer.send({
		recipients: [user.email],
		subject: "Verification Successful",
		email: VerificationSuccessful({ user }),
	});

	const tokens = await generateTokens(user);

	return Result.ok({
		code: "AUTH_CREDENTIALS",
		data: tokens,
	});
};
