import { describe, test } from "node:test";
import assert from "node:assert";
import { faker } from "@faker-js/faker";
import { AuthTokenRepository, AuthUserRepository } from "@/features/auth/repository";
import { SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY } from "@/types";
import { getStore, sleep, client } from "../utils";
import { Container } from "@n8n/di";

describe("auth", async () => {
	const authUserRepository = Container.get(AuthUserRepository)
	const authTokenRepository = Container.get(AuthTokenRepository)

	const store = await getStore();

	const email = faker.internet.email();

	test("sign up", async () => {
		const res = await client.POST("/auth/sign-up", {
			body: {
				email,
				full_name: faker.person.fullName(),
				phone_number: faker.phone.number(),
			},
		});

		assert(
			!res.error,
			`Sign up should not return an error: ${res.error?.code}`,
		);
	});

	test("sign up verification", async () => {
		const findUserResult = await authUserRepository.findByEmail(email);

		assert(findUserResult.isOk, "User should be created");
		assert(findUserResult.value, "User should not be null");

		const user = findUserResult.value;

		const findTokenResult = await authTokenRepository.findByUserIdAndPurpose({
			user_id: user.id,
			purpose: SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY,
		});

		assert(findTokenResult.isOk, "Token should be created");
		assert(findTokenResult.value, "Token should not be null");

		const token = findTokenResult.value;

		const res = await client.POST("/auth/sign-up/verification", {
			body: {
				email,
				otp: token.token,
			},
		});

		assert(
			!res.error,
			`Sign up verification should not return an error: ${res.error?.code}`,
		);
	});

	test("sign in", async () => {
		const findUserResult = await authUserRepository.findByEmail(email);
		assert(findUserResult.isOk, "User should be created");
		assert(findUserResult.value, "User should not be null");

		const res = await client.POST("/auth/sign-in", {
			body: {
				email,
			},
		});

		assert(
			!res.error,
			`Sign in should not return an error: ${res.error?.code}`,
		);
	});

	test("sign in verification", async () => {
		const findUserResult = await authUserRepository.findByEmail(email);
		assert(findUserResult.isOk, "User should be created");
		assert(findUserResult.value, "User should not be null");

		const user = findUserResult.value;

		const findTokenResult = await authTokenRepository.findByUserIdAndPurpose({
			user_id: user.id,
			purpose: "SIGN_IN_VERIFICATION",
		});

		assert(findTokenResult.isOk, "Token should be created");
		assert(findTokenResult.value, "Token should not be null");

		const token = findTokenResult.value;

		const res = await client.POST("/auth/sign-in/verification", {
			body: {
				email,
				otp: token.token,
			},
		});

		assert(
			!res.error,
			`Sign in verification should not return an error: ${res.error?.code}`,
		);

		await store.setStage("001", {
			...store.state,
			user: {
				email,
			},
			auth: res.data.data,
		});
	});

	test("sign in verification resend", async () => {
		await sleep(2000);

		const res = await client.POST("/auth/sign-in/verification/resend", {
			body: {
				email,
			},
		});

		assert(
			!res.error,
			`Sign in verification resend should not return an error: ${res.error?.code}`,
		);
	});
});
