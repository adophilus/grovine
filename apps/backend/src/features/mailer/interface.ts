import type { Result, Unit } from 'true-myth'

export type MailerError = 'ERR_MAIL_NOT_SENT'

abstract class Mailer {
  public abstract send(payload: {
    recipients: string[]
    subject: string
    email: JSX.Element
  }): Promise<Result<Unit, MailerError>>
}

export default Mailer
