import { Result, type Unit } from 'true-myth'
import type { MailerError } from './interface'

class TestMailer {
  public async send(_: {
    recipients: string[]
    subject: string
    email: JSX.Element
  }): Promise<Result<Unit, MailerError>> {
    return Result.ok()
  }
}

export default TestMailer
