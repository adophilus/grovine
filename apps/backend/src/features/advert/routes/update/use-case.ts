import type { Request, Response } from "./types";
import { Result } from "true-myth";
import { Storage } from "@/features/storage";
import type { UploadedData } from "@/features/storage/types";
import { AdvertRepository } from "../../repository";
import { Service } from "@n8n/di";

@Service()
class UpdateAdvertUseCase {
	constructor(private advertRepository: AdvertRepository) {}

	async execute(
		id: string,
		payload: Request.Body,
	): Promise<Result<Response.Success, Response.Error>> {
		const findAdvertResult = await this.advertRepository.findById(id);

		if (findAdvertResult.isErr) {
			return Result.err({ code: "ERR_UNEXPECTED" });
		}

		if (!findAdvertResult.value) {
			return Result.err({ code: "ERR_ADVERTISEMENT_NOT_FOUND" });
		}

		const { image, ..._payload } = payload;

		let updatedImage: UploadedData | undefined = undefined;

		if (image) {
			const uploadImageResult = await Storage.service.upload(image);

			if (uploadImageResult.isErr) {
				return Result.err({
					code: "ERR_UNEXPECTED",
				});
			}

			updatedImage = uploadImageResult.value;
		}

		const updatePayload = {
			..._payload,
			image: updatedImage,
		};

		const updateAdvertResult = await this.advertRepository.updateById(
			id,
			updatePayload,
		);

		if (updateAdvertResult.isErr) {
			return Result.err({ code: "ERR_UNEXPECTED" });
		}

		return Result.ok({
			code: "ADVERTISEMENT_UPDATED",
		});
	}
}

export default UpdateAdvertUseCase;
