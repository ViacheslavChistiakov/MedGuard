import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

// Presentational only - no i18n here. Callers (lib/resend/send.ts) pass in
// already-translated copy so this template stays independent of request
// context and easy to preview/test in isolation.
export interface PaymentLinkEmailProps {
  heading: string
  greeting: string
  body: string
  planName: string
  planDescription: string
  priceLabel: string
  priceValue: string
  buttonLabel: string
  paymentUrl: string
}

export function PaymentLinkEmail({
  heading,
  greeting,
  body,
  planName,
  planDescription,
  priceLabel,
  priceValue,
  buttonLabel,
  paymentUrl,
}: PaymentLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{body}</Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "Helvetica, Arial, sans-serif" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "8px", maxWidth: "480px" }}>
          <Heading style={{ fontSize: "20px", margin: "0 0 16px" }}>{heading}</Heading>
          <Text style={{ fontSize: "14px", color: "#3f3f46" }}>{greeting}</Text>
          <Text style={{ fontSize: "14px", color: "#3f3f46" }}>{body}</Text>

          <Section style={{ backgroundColor: "#f4f4f5", borderRadius: "6px", padding: "16px", margin: "24px 0" }}>
            <Text style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 4px" }}>{planName}</Text>
            <Text style={{ fontSize: "13px", color: "#71717a", margin: "0 0 12px" }}>{planDescription}</Text>
            <Text style={{ fontSize: "13px", color: "#71717a", margin: 0 }}>
              {priceLabel}: <strong style={{ color: "#18181b" }}>{priceValue}</strong>
            </Text>
          </Section>

          <Button
            href={paymentUrl}
            style={{
              backgroundColor: "#0f766e",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              padding: "12px 20px",
              borderRadius: "6px",
              textDecoration: "none",
            }}
          >
            {buttonLabel}
          </Button>

          <Hr style={{ margin: "32px 0 16px", borderColor: "#e4e4e7" }} />
          <Text style={{ fontSize: "12px", color: "#a1a1aa" }}>MedGuard</Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PaymentLinkEmail
