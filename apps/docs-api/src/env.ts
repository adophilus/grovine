import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const ENV = import.meta.env;

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    NODE_ENV: z.enum(["production", "staging", "development", "test"]),
    BACKEND_URL: z.string().url(),
  },
  server: {},
  runtimeEnv: {
    NODE_ENV: ENV.VITE_NODE_ENV,
    BACKEND_URL: ENV.BACKEND_URL,
  },
});
