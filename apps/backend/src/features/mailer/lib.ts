import nodemailer from 'nodemailer'
import { config } from '../config'
import { Result, type Unit } from 'true-myth'
import type { ReactElement } from 'react'
import { render } from 'jsx-email'
import { logger } from './logger'

export namespace Mailer {
  type Error = 'ERR_MAIL_NOT_SENT'

  const transporter = nodemailer.createTransport({
    url: config.mail.url,
    headers: { 'Content-Transfer-Encoding': 'quoted-printable' }
  })

  transporter.on('error', (err) => {
    logger.error('Nodemailer transporter error:', err)
  })

  export type Payload = {
    recipients: string[]
    subject: string
    email: ReactElement
  }

  export const send = async (
    payload: Payload
  ): Promise<Result<Unit, Error>> => {
    const recipients = payload.recipients.join(', ')
    try {
      const plainText = await render(payload.email)
      const htmlText = await render(payload.email)

      await transporter.sendMail({
        from: `"${config.mail.sender.name}" <${config.mail.sender.email}>`,
        to: recipients,
        subject: payload.subject,
        text: plainText,
        html: htmlText
      })

      return Result.ok()
    } catch (err) {
      logger.error('Failed to send mail to recipients: ', recipients, err)
      return Result.err('ERR_MAIL_NOT_SENT')
    }
  }
}
