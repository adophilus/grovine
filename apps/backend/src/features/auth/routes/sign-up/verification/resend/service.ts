import { Result } from "true-myth";
import Repository from "../../../repository";
import type { Schema } from "./schema";
import type { User } from "@/types";
import { Mailer } from "@/features/mailer";
import SignUpVerificationMail from "./mail/sign-up-verification";
import { ulid } from "ulidx";
import { config } from "@/features/config";
import { addMinutes, getUnixTime } from "date-fns";

export type Payload = Schema;

type Error = "ERR_EMAIL_ALREADY_IN_USE" | "ERR_UNEXPECTED";

const SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY = "SIGN_UP_VERIFICATION";

export default async (
	payload: Payload,
): Promise<Result<User.Selectable, Error>> => {
	const existingUserResult = await Repository.findByEmail(payload.email);
	if (existingUserResult.isErr) {
		return Result.err("ERR_UNEXPECTED");
	}

	const existingUser = existingUserResult.value;
	if (existingUser) return Result.err("ERR_EMAIL_ALREADY_IN_USE");

	const userCreationResult = await Repository.createUser(payload);

	if (userCreationResult.isErr) return Result.err("ERR_UNEXPECTED");

	const user = userCreationResult.value;

	const tokenExpiryTime = getUnixTime(
		addMinutes(
			Date.now(),
			config.environment.PRODUCTION || config.environment.STAGING ? 5 : 1,
		),
	);

	const tokenCreationResult = await Repository.createToken({
		id: ulid(),
		token: "12345",
		purpose: SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY,
		user_id: user.id,
		expires_at: tokenExpiryTime,
	});

	if (tokenCreationResult.isErr) return Result.err("ERR_UNEXPECTED");

	const token = tokenCreationResult.value;

	await Mailer.send({
		recipients: [user.email],
		subject: "Verify your account",
		email: SignUpVerificationMail({ token }),
	});

	return Result.ok(user);
};
