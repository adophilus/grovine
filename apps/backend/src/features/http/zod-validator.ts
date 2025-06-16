import type { Env, ValidationTargets, Input, MiddlewareHandler } from 'hono'
import type { ZodSchema } from 'zod'
import type { z } from 'zod'
import { type Hook, zValidator as zValidatorHono } from '@hono/zod-validator'
import type { types } from '@grovine/api'
import { StatusCodes } from './status-codes'

type HasUndefined<T> = undefined extends T ? true : false

export function zValidator<
  T extends ZodSchema<any, z.ZodTypeDef, any>,
  Target extends keyof ValidationTargets,
  E extends Env,
  P extends string,
  In = z.input<T>,
  Out = z.output<T>,
  I extends Input = {
    in: HasUndefined<In> extends true
      ? {
          [K in Target]?:
            | (In extends ValidationTargets[K]
                ? In
                : { [K2 in keyof In]?: ValidationTargets[K][K2] | undefined })
            | undefined
        }
      : {
          [K_1 in Target]: In extends ValidationTargets[K_1]
            ? In
            : { [K2_1 in keyof In]: ValidationTargets[K_1][K2_1] }
        }
    out: { [K_2 in Target]: Out }
  },
  V extends I = I
>(
  target: Target,
  schema: T,
  hook?: Hook<z.TypeOf<T>, E, P, Target, {}> | undefined
): MiddlewareHandler<E, P, V>

export function zValidator(target: unknown, schema: unknown) {
  // biome-ignore lint/suspicious/noExplicitAny: too complex for me
  return zValidatorHono(target as any, schema as any, (result, c) => {
    let response: types.components['schemas']['Api.BadRequestError']

    if (!result.success) {
      response = {
        code: 'ERR_EXPECTED_DATA_NOT_RECEIVED',
        data: result.error.flatten()
      }

      return c.json(response, StatusCodes.BAD_REQUEST)
    }
  })
}
