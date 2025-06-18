import type { z } from 'zod';
import { schema as apiSchema, type types } from '@grovine/api';

export namespace Request {
  export type Path = { user_id: string }; 
}

export namespace Response {
  type Endpoint = '/wallets/{id}';

  export type Response =
    types.paths[Endpoint]['get']['responses'][keyof types.paths[Endpoint]['get']['responses']]['content']['application/json'];

  export type Success = Extract<Response, { code: 'WALLET_FOUND' }>; 
  export type Error = Exclude<Response, Success>;
}