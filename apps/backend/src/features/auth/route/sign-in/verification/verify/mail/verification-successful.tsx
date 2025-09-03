import { Body, Container, Head, Heading, Html, Img, Text } from 'jsx-email'

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif'
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '5px',
  boxShadow: '0 5px 10px rgba(20,50,70,.2)',
  marginTop: '20px',
  width: '360px',
  margin: '0 auto',
  padding: '68px 0 130px'
}

const logo = {
  margin: '0 auto'
}

const tertiary = {
  color: '#2a9b7d',
  fontSize: '11px',
  fontWeight: 700,
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  height: '16px',
  letterSpacing: '0',
  lineHeight: '16px',
  margin: '16px 8px 8px 8px',
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const
}

const secondary = {
  color: '#000',
  display: 'inline-block',
  fontFamily: 'HelveticaNeue-Medium,Helvetica,Arial,sans-serif',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '24px',
  marginBottom: '0',
  marginTop: '0',
  textAlign: 'center' as const
}

const logoUrl = 'https://via.placeholder.com/512'

export default function VerificationSuccessful() {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src={logoUrl}
            width="212"
            height="88"
            alt="Grovine"
            style={logo}
          />
          <Text style={tertiary}>Verification Successful</Text>
          <Heading style={secondary}>
            Thank you for verifying your account
          </Heading>
        </Container>
      </Body>
    </Html>
  )
}
