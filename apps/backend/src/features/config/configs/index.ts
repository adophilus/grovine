import DatabaseConfig from './database'
import EnvironmentConfig from './environment'
import MailConfig from './mail'
import ServerConfig from './server'
import UploadConfig from './upload'
import StorageConfig from './storage'
import AuthConfig from './auth'
import PaymentConfig from './payment'

export default {
  auth: AuthConfig,
  db: DatabaseConfig,
  environment: EnvironmentConfig,
  mail: MailConfig,
  payment: PaymentConfig,
  upload: UploadConfig,
  server: ServerConfig,
  storage: StorageConfig
}
