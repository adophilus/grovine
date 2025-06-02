import { Result } from "true-myth";
import Repository from "../../../repository";
import { SIGN_IN_VERIFICATION_TOKEN_PURPOSE_KEY, type User } from "@/types";
import { Mailer } from "@/features/mailer";
import SignUpVerificationMail from "./mail/sign-up-verification";
import { ulid } from "ulidx";
import { config } from "@/features/config";
import { addMinutes, getUnixTime } from "date-fns";
import type { Request } from "./types";
import { generateToken } from "@/features/auth/utils/token";

export type Payload = Request.Body;

type Error = "ERR_UNEXPECTED" | "ERR_USER_NOT_FOUND";

export default async (
	payload: Payload,
): Promise<Result<User.Selectable, Error>> => {
	const existingUserResult = await Repository.findUserByEmail(payload.email);
	if (existingUserResult.isErr) {
		return Result.err("ERR_UNEXPECTED");
	}

	const user = existingUserResult.value;
	if (!user) return Result.err("ERR_USER_NOT_FOUND");

	const tokenExpiryTime = getUnixTime(
		addMinutes(
			Date.now(),
			config.environment.PRODUCTION || config.environment.STAGING ? 5 : 1,
		),
	);

	const tokenCreationResult = await Repository.createToken({
		id: ulid(),
		token: generateToken(),
		purpose: SIGN_IN_VERIFICATION_TOKEN_PURPOSE_KEY,
		user_id: user.id,
		expires_at: tokenExpiryTime,
	});

	if (tokenCreationResult.isErr) return Result.err("ERR_UNEXPECTED");

	const token = tokenCreationResult.value;

	await Mailer.send({
		recipients: [user.email],
		subject: "Here's your verification code",
		email: SignUpVerificationMail({ token }),
	});

	return Result.ok(user);
};
