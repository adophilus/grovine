import { render, renderPlainText } from 'jsx-email'
import nodemailer from 'nodemailer'
import { Result, type Unit } from 'true-myth'
import type { Logger } from '@/features/logger'
import { config } from '../config'
import type { MailerError } from './interface'

class NodemailerMailer {
  declare transporter: nodemailer.Transporter

  constructor(private logger: Logger) {
    this.transporter = nodemailer.createTransport({
      url: config.mail.url,
      headers: { 'Content-Transfer-Encoding': 'quoted-printable' }
    })

    this.transporter.on('error', (err) => {
      this.logger.error('Nodemailer transporter error:', err)
    })
  }

  async send(payload: {
    recipients: string[]
    subject: string
    email: JSX.Element
  }): Promise<Result<Unit, MailerError>> {
    const recipients = payload.recipients.join(', ')
    try {
      const plainText = await renderPlainText(payload.email)
      const htmlText = await render(payload.email)

      await this.transporter.sendMail({
        from: `"${config.mail.sender.name}" <${config.mail.sender.email}>`,
        to: recipients,
        subject: payload.subject,
        text: plainText,
        html: htmlText
      })

      return Result.ok()
    } catch (err) {
      this.logger.error('Failed to send mail to recipients: ', recipients, err)
      return Result.err('ERR_MAIL_NOT_SENT')
    }
  }
}

export default NodemailerMailer
