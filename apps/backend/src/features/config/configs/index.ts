import AuthConfig from './auth'
import DatabaseConfig from './database'
import EnvironmentConfig from './environment'
import MailConfig from './mail'
import OtelConfig from './otel'
import PaymentConfig from './payment'
import ServerConfig from './server'
import StorageConfig from './storage'
import UploadConfig from './upload'

export default {
  auth: AuthConfig,
  db: DatabaseConfig,
  environment: EnvironmentConfig,
  mail: MailConfig,
  payment: PaymentConfig,
  upload: UploadConfig,
  server: ServerConfig,
  storage: StorageConfig,
  otel: OtelConfig
}
