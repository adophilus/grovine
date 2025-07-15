import "reflect-metadata";

import { serve } from "@hono/node-server";
import {
	bootstrap,
	createApp,
	config,
	appLogger as logger,
} from "@grovine/backend";

bootstrap();
const app = createApp();

serve(
	{
		fetch: app.fetch,
		port: config.server.port,
	},
	(info) => {
		logger.info(`Server is running on https://${info.address}:${info.port}`);
	},
);
