import { Result } from "true-myth";
import { compareAsc } from "date-fns";
import Repository from "../../repository";
import type { Schema } from "./schema";

type Payload = Schema;

type Error = "INVALID_OR_EXPIRED_OTP_ERROR" | "UNEXPECTED_ERROR";

export default async (payload: Payload): Promise<Result<null, Error>> => {
	const findUserResult = await Repository.findUserByEmail(payload.email);
	if (findUserResult.isErr) {
		return Result.err("ERR_UNEXPECTED");
	}

	const user = findUserResult.value;
	if (!user) return Result.err("INVALID_OR_EXPIRED_OTP_ERROR");

	const findVerificationTokenResult =
		await Repository.findVerificationTokenByUserId(user.id);

	if (findVerificationTokenResult.isErr) return Result.err("ERR_UNEXPECTED");

	const verificationToken = findVerificationTokenResult.value;

	if (!verificationToken) return Result.err("INVALID_OR_EXPIRED_OTP_ERROR");

	const hasTokenExpired =
		compareAsc(verificationToken.expires_at, Date.now()) === -1;
	if (hasTokenExpired) return Result.err("INVALID_OR_EXPIRED_OTP_ERROR");

	if (verificationToken.token !== payload.otp)
		return Result.err("INVALID_OR_EXPIRED_OTP_ERROR");

	const verificationResult = await Repository.verifyUserById(user.id);

	if (verificationResult.isErr) return Result.err("ERR_UNEXPECTED");

	return Result.ok(null);
};
