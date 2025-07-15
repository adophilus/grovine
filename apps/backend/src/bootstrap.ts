import { Container } from "@n8n/di";
import { createKyselyClient, KyselyClient } from "./features/database";
import { AdvertRepository } from "./features/advert/repository";
import { AdvertKyselyRepository } from "./features/advert/repository/kysely";
import { globalLogger } from "./features/logger";
import ListAdvertUseCase from "./features/advert/routes/list/use-case";

export const bootstrap = () => {
	const logger = globalLogger.getSubLogger({ name: "ServerLogger" });

	const kyselyClient = createKyselyClient();
	const advertRepository = new AdvertKyselyRepository(kyselyClient);

	Container.set(KyselyClient, kyselyClient);
	Container.set(AdvertRepository, advertRepository);
	Container.set(ListAdvertUseCase, new ListAdvertUseCase(advertRepository));

	logger.info("✅ Registered services");
};
