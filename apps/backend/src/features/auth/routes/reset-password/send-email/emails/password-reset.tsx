import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text
} from 'jsx-email'
import type { User } from '../../../../../database/schema'

interface PasswordResetEmailProps {
  user: User
  resetPasswordLink: string
  websiteLink: string
}

const logoUrl = 'https://betalyfe.com.ng/images/betalyfe-icon.svg'

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0'
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px'
}

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px'
}

const anchor = {
  textDecoration: 'underline'
}

export default function PasswordResetEmail({
  user,
  resetPasswordLink,
  websiteLink
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>BetaLyfe reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={logoUrl} width="40" height="33" alt="BetaLyfe" />
          <Section>
            <Text style={text}>Hi {user.first_name},</Text>
            <Text style={text}>
              Someone recently requested a password change for your BetaLyfe
              account. If this was you, you can set a new password here:
            </Text>
            <Button
              backgroundColor="#2a9b7d"
              borderRadius={4}
              borderColor="#000000"
              textColor="#fff"
              fontSize={15}
              width={210}
              height={42}
              href={resetPasswordLink}
            >
              Reset password
            </Button>
            <Text style={text}>
              If you don&apos;t want to change your password or didn&apos;t
              request this, just ignore and delete this message.
            </Text>
            <Text style={text}>
              To keep your account secure, please don&apos;t forward this email
              to anyone. See our Help Center for{' '}
              <Link style={anchor} href={websiteLink}>
                more security tips.
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
