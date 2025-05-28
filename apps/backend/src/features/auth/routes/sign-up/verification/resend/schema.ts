import type { z } from "zod";
import { schema as apiSchema } from "@grovine/api";

const schema = apiSchema.schemas.Api_Authentication_SignUp_SignUp_Request_Body;

export type Schema = z.infer<typeof schema>;
export default schema;
