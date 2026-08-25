import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components"

// Presentational only - see payment-link-email.tsx for why there's no i18n
// in here directly.
export interface PaymentConfirmedEmailProps {
  heading: string
  greeting: string
  body: string
  planName: string
  planDescription: string
  priceLabel: string
  priceValue: string
  viewPlanLabel: string
  viewPlanUrl: string
}

export function PaymentConfirmedEmail({
  heading,
  greeting,
  body,
  planName,
  planDescription,
  priceLabel,
  priceValue,
  viewPlanLabel,
  viewPlanUrl,
}: PaymentConfirmedEmailProps) {
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
            href={viewPlanUrl}
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
            {viewPlanLabel}
          </Button>

          <Hr style={{ margin: "32px 0 16px", borderColor: "#e4e4e7" }} />
          <Text style={{ fontSize: "12px", color: "#a1a1aa" }}>MedGuard</Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PaymentConfirmedEmail
