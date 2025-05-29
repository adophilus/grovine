import { Result } from "true-myth";
import Repository from "@/features/auth/repository";
import { generateAccessToken, generateRefreshToken } from "../../utils/token";
import { comparePasswords } from "../../utils/password-utils";

type Payload = {
	email: string;
	password: string;
};

type Response = {
	accessToken: string;
	refreshToken: string;
};

type Error = "INVALID_CREDENTIALS";

export default async (payload: Payload): Promise<Result<Response, Error>> => {
	const findUserResult = await Repository.findUserByEmail(payload.email);

	if (findUserResult.isErr) return Result.err("INVALID_CREDENTIALS");

	const user = findUserResult.value;

	if (!user) return Result.err("INVALID_CREDENTIALS");

	const findAuthMethodResult =
		await Repository.findAuthenticationMethodByUserId(user.id);
	if (findAuthMethodResult.isErr) return Result.err("INVALID_CREDENTIALS");

	const authMethod = findAuthMethodResult.value;
	if (!authMethod) return Result.err("INVALID_CREDENTIALS");

	const isPasswordValid = await comparePasswords(
		payload.password,
		authMethod.meta.data,
	);
	if (!isPasswordValid) return Result.err("INVALID_CREDENTIALS");

	const accessToken = await generateAccessToken(user.id);
	const refreshToken = await generateRefreshToken(user.id);

	return Result.ok({
		accessToken,
		refreshToken,
		role: user.role,
	});
};
