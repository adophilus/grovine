import type { z } from "zod";
import { schema as apiSchema, type types } from "@grovine/api";

export namespace Request {
  export const body = apiSchema.schemas.api_authentication_profile;

  export type Body = z.infer<typeof body>;
}

export namespace Response {
  type Endpoint = "/api/auth/profile";

  export type Response =
    types.paths[Endpoint]["get"]["responses"][keyof types.paths[Endpoint]["get"]["responses"]]["content"]["application/json"];
}
