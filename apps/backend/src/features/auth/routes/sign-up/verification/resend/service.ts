import { Result } from "true-myth";
import Repository from "../../../../repository";
import { SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY, type Token } from "@/types";
import { Mailer } from "@/features/mailer";
import VerificationMail from "./mail/verification";
import { ulid } from "ulidx";
import { config } from "@/features/config";
import { addMinutes, compareAsc, getUnixTime } from "date-fns";
import type { Request, Response } from "./types";
import { generateToken } from "@/features/auth/utils/token";

export type Payload = Request.Body;

export default async (
	payload: Payload,
): Promise<Result<Response.Response, Response.Error>> => {
	const existingUserResult = await Repository.findUserByEmail(payload.email);
	if (existingUserResult.isErr) {
		return Result.err({
			code: "ERR_UNEXPECTED",
		});
	}

	const existingUser = existingUserResult.value;
	if (!existingUser)
		return Result.err({
			code: "ERR_USER_NOT_FOUND",
		});

	const user = existingUser;

	const tokenExpiryTime = getUnixTime(
		addMinutes(
			Date.now(),
			config.environment.PRODUCTION || config.environment.STAGING ? 5 : 1,
		),
	);

	const existingTokenResult = await Repository.findTokenByUserIdAndPurpose({
		user_id: user.id,
		purpose: SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY,
	});
	if (existingTokenResult.isErr) {
		return Result.err({
			code: "ERR_UNEXPECTED",
		});
	}

	const existingToken = existingTokenResult.value;
	let token: Token.Selectable;

	if (!existingToken) {
		const tokenCreationResult = await Repository.createToken({
			id: ulid(),
			token: generateToken(),
			purpose: SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY,
			user_id: user.id,
			expires_at: tokenExpiryTime,
		});

		if (tokenCreationResult.isErr)
			return Result.err({
				code: "ERR_UNEXPECTED",
			});

		token = tokenCreationResult.value;
	} else {
		const hasTokenExpired =
			compareAsc(Date.now(), existingToken.expires_at) === 1;
		if (!hasTokenExpired) {
			return Result.err({
				code: "ERR_TOKEN_NOT_EXPIRED",
			});
		}

		const updateTokenResult = await Repository.updateTokenById(
			existingToken.id,
			{
				expires_at: tokenExpiryTime,
				token: generateToken(),
			},
		);

		if (updateTokenResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		token = updateTokenResult.value;
	}

	await Mailer.send({
		recipients: [user.email],
		subject: "Verify your account",
		email: VerificationMail({ token }),
	});

	return Result.ok({
		code: "VERIFICATION_EMAIL_SENT",
	});
};
