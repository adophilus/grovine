import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const ENV = import.meta.env;

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_NODE_ENV: z.enum(["production", "staging", "development", "test"]),
    VITE_BACKEND_URL: z.string().url(),
  },
  server: {},
  runtimeEnv: {
    VITE_NODE_ENV: ENV.VITE_NODE_ENV,
    VITE_BACKEND_URL: ENV.BACKEND_URL,
  },
});
