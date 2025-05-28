import { Result } from "true-myth";
import Repository from "../../../../repository";
import { SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY, type User } from "@/types";
import type { Request } from "./types";
import { Mailer } from "@/features/mailer";
import VerificationSuccessful from "./mail/verification-successful";

export type Payload = Request.Body;

type Error = "ERR_INVALID_OR_EXPIRED_TOKEN" | "ERR_UNEXPECTED";

type Tokens = {
	access_token: string;
	refresh_token: string;
};

export default async (payload: Payload): Promise<Result<Tokens, Error>> => {
	const existingUserResult = await Repository.findUserByEmail(payload.email);
	if (existingUserResult.isErr) {
		return Result.err("ERR_UNEXPECTED");
	}

	const existingUser = existingUserResult.value;
	if (!existingUser) {
		return Result.err("ERR_INVALID_OR_EXPIRED_TOKEN");
	}

	const existingTokenResult = await Repository.findTokenByUserIdAndPurpose({
		purpose: SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY,
		user_id: existingUser.id,
	});

	if (existingTokenResult.isErr) {
		return Result.err("ERR_UNEXPECTED");
	}

	const existingToken = existingTokenResult.value;

	if (!existingToken || existingToken.token !== payload.otp) {
		return Result.err("ERR_INVALID_OR_EXPIRED_TOKEN");
	}

	const userUpdateResult = await Repository.updateUserById(existingUser.id, {
		verified_at: Date.now(),
	});

	if (userUpdateResult.isErr) {
		return Result.err("ERR_UNEXPECTED");
	}

	const user = userUpdateResult.value;

	await Mailer.send({
		recipients: [user.email],
		subject: "Verification Successful",
		email: VerificationSuccessful({ user }),
	});

	const tokens = generateTokens();

	return Result.ok(tokens);
};

// TODO: make this function work
const generateTokens = (): Tokens => {};
