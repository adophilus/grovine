import { ulid } from "ulidx";
import type { Request, Response } from "./types";
import { Result } from "true-myth";
import { Storage } from "@/features/storage";
import type { AdvertRepository } from "../../repository";

class CreateAdvertUseCase {
	constructor(private advertRepository: AdvertRepository) {}

	async execute(
		payload: Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		const { image, ..._payload } = payload;
		const uploadImageResult = await Storage.service.upload(image);

		if (uploadImageResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		const uploadedImage = uploadImageResult.value;
		const createAdvertResult = await this.advertRepository.create({
			..._payload,
			media: uploadedImage,
			id: ulid(),
		});

		if (createAdvertResult.isErr) {
			return Result.err({
				code: "ERR_UNEXPECTED",
			});
		}

		return Result.ok({
			code: "ADVERTISEMENT_CREATED",
		});
	}
}

export default CreateAdvertUseCase;
