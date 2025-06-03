import { config } from "@/index";
import { createClient } from "@grovine/api";
import { describe, test } from "node:test";
import assert from "node:assert";
import { faker } from "@faker-js/faker";
import { AuthRepository } from "@/features/auth";
import { SIGN_UP_VERIFICATION_TOKEN_PURPOSE_KEY } from "@/types";

const client = createClient(config.server.url);

describe("auth", () => {
  const email = faker.internet.email();

  test("sign up", async () => {
    const res = await client.POST("/auth/sign-up", {
      body: {
        email,
        full_name: faker.person.fullName(),
        phone_number: faker.phone.number(),
      },
    });

    assert(!res.error, res.error?.code);
  });

  test("sign up verification", async () => {
    const findUserResult = await AuthRepository.findUserByEmail(email);

    assert(findUserResult.isOk, "User should be created");
    assert(findUserResult.value, "User should not be null");

    const user = findUserResult.value;

    const findTokenResult = await AuthRepository.findTokenByUserIdAndPurpose({
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

    assert(!res.error, res.error?.code);
  });
});
