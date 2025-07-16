import { Container } from "@n8n/di";
import { createKyselyClient, KyselyClient } from "./features/database/kysely";
import { AdvertRepository } from "./features/advert/repository";
import { AdvertKyselyRepository } from "./features/advert/repository/kysely";
import {
	CreateAdvertUseCase,
	DeleteAdvertUseCase,
	ListAdvertUseCase,
	UpdateAdvertUseCase,
} from "./features/advert/use-case";
import { Logger } from "./features/logger";
import { HonoApp } from "./features/app";
import { config } from "./features/config";

export const bootstrap = () => {
	const logger = new Logger({ name: "App" });

	const kyselyClient = createKyselyClient();
	const advertRepository = new AdvertKyselyRepository(kyselyClient);

	const createAdvertUseCase = new CreateAdvertUseCase(advertRepository);
	const listAdvertUseCase = new ListAdvertUseCase(advertRepository);
	const updateAdvertUseCase = new UpdateAdvertUseCase(advertRepository);
	const deleteAdvertUseCase = new DeleteAdvertUseCase(advertRepository);

	const app = new HonoApp(logger);

	Container.set(KyselyClient, kyselyClient);
	Container.set(AdvertRepository, advertRepository);

	Container.set(CreateAdvertUseCase, createAdvertUseCase);
	Container.set(ListAdvertUseCase, listAdvertUseCase);
	Container.set(UpdateAdvertUseCase, updateAdvertUseCase);
	Container.set(DeleteAdvertUseCase, deleteAdvertUseCase);

	return { app, logger, config };
};
