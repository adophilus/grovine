import { env } from '../env'

const MailConfig = {
  url: env.MAIL_URL,
  sender: {
    name: env.MAIL_SENDER_NAME,
    email: env.MAIL_SENDER_EMAIL
  },
  support: {
    name: env.MAIL_SUPPORT_NAME,
    email: env.MAIL_SUPPORT_EMAIL
  }
}

export default MailConfig
