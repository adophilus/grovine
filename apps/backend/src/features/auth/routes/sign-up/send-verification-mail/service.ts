import { Result } from "true-myth";
import Repository from "../../../repository";
import { SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY, type User } from "@/types";
import { Mailer } from "@/features/mailer";
import SignUpVerificationMail from "./mail/sign-up-verification";
import { ulid } from "ulidx";
import { config } from "@/features/config";
import { addMinutes, getUnixTime } from "date-fns";
import type { Request } from "./types";

export type Payload = Request.Body;

type Error = "ERR_EMAIL_ALREADY_IN_USE" | "ERR_UNEXPECTED";

export default async (
	payload: Payload,
): Promise<Result<User.Selectable, Error>> => {
	const existingUserResult = await Repository.findUserByEmail(payload.email);
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
		token: generateToken(),
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

const generateToken = (): string => {
	const token = Math.floor(100000 + Math.random() * 900000).toString();
	return token;
};
