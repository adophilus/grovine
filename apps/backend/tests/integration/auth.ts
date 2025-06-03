import { config } from "@/index";
import { createClient } from "@grovine/api";
import { assert, describe, expect, test } from "vitest";
import { faker } from "@faker-js/faker";

const client = createClient(config.server.url);

describe("auth", () => {
  test("sign up", async () => {
    const res = await client.POST("/api/auth/sign-up", {
      body: {
        email: faker.internet.email(),
        full_name: faker.person.fullName(),
        phone_number: faker.phone.number(),
      },
    });

    assert(!res.error, res.error?.code);
  });

  test("sign up verification", async () => {
    const res = await client.POST("/api/auth/sign-up/verification", {
      body: {
        email: faker.internet.email(),
        token: faker.string.numeric(6),
      },
    });

    assert(!res.error, res.error?.code);
  });
});
