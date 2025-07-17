import { bootstrap } from "@/bootstrap";

const { app: appClass, logger } = bootstrap();

const app = appClass.create()

export { app, logger };
