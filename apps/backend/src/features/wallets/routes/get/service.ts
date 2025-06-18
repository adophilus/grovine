import Repository from "../../repository";
import type { Request, Response } from "./types";
import { Result } from "true-myth";
import type { User } from "@/types";

export default async (
  payload: User.Selectable
): Promise<Result<Response.Success, Response.Error>> => {
  const { id } = payload;

  const topupResult = await Repository.findWalletByUserId({ user_id: id });

  if (topupResult.isErr) {
    return Result.err({
      code: "ERR_UNEXPECTED",
    });
  }

  return Result.ok({
    code: "WALLET_FOUND",
    wallet: topupResult.value,
  });
};