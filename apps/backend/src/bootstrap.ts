import { Container } from "@n8n/di";
import { createKyselyClient, KyselyClient } from "./features/database";
import { AdvertRepository } from "./features/advert/repository";
import { AdvertKyselyRepository } from "./features/advert/repository/kysely";
import { globalLogger } from "./features/logger";
import {
	CreateAdvertUseCase,
	DeleteAdvertUseCase,
	ListAdvertUseCase,
	UpdateAdvertUseCase,
} from "./features/advert/use-case";

export const bootstrap = () => {
	const logger = globalLogger.getSubLogger({ name: "ServerLogger" });

	const kyselyClient = createKyselyClient();
	const advertRepository = new AdvertKyselyRepository(kyselyClient);

	const createAdvertUseCase = new CreateAdvertUseCase(advertRepository);
	const listAdvertUseCase = new ListAdvertUseCase(advertRepository);
	const updateAdvertUseCase = new UpdateAdvertUseCase(advertRepository);
	const deleteAdvertUseCase = new DeleteAdvertUseCase(advertRepository);

	Container.set(KyselyClient, kyselyClient);
	Container.set(AdvertRepository, advertRepository);

	Container.set(CreateAdvertUseCase, createAdvertUseCase);
	Container.set(ListAdvertUseCase, listAdvertUseCase);
	Container.set(UpdateAdvertUseCase, updateAdvertUseCase);
	Container.set(DeleteAdvertUseCase, deleteAdvertUseCase);

	logger.info("✅ Registered services");
};
