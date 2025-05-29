import type { User } from "@/types";
import { SignJWT } from "jose";
import { addMinutes } from "date-fns";
import { config } from "@/features/config";

export const generateToken = (): string => {
	return Math.floor(10000 + Math.random() * 90000).toString();
};

const alg = "HS256";
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export type Tokens = {
	access_token: string;
	refresh_token: string;
};

export const generateTokens = async (
	user: User.Selectable,
): Promise<Tokens> => {
	const accessTokenExpiration = addMinutes(
		Date.now(),
		config.auth.token.access.expiry,
	);

	const accessToken = await new SignJWT({ user_id: user.id })
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setExpirationTime(accessTokenExpiration)
		.sign(secret);

	const refreshTokenExpiration = addMinutes(
		Date.now(),
		config.auth.token.refresh.expiry,
	);

	const refreshToken = await new SignJWT({ user_id: user.id })
		.setProtectedHeader({ alg })
		.setIssuedAt()
		.setExpirationTime(refreshTokenExpiration)
		.sign(secret);

	return { access_token: accessToken, refresh_token: refreshToken };
};
