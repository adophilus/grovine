import DatabaseConfig from "./database";
import EnvironmentConfig from "./environment";
import MailConfig from "./mail";
import ServerConfig from "./server";
import UploadConfig from "./upload";
import StorageConfig from "./storage";
import AuthConfig from "./auth";
import FrontendConfig from "./frontend";

export default {
	auth: AuthConfig,
	frontend: FrontendConfig,
	db: DatabaseConfig,
	environment: EnvironmentConfig,
	mail: MailConfig,
	upload: UploadConfig,
	server: ServerConfig,
	storage: StorageConfig,
};
