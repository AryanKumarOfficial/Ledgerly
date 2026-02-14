import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Heading,
} from "@react-email/components";
import { button, container, footer, main, smallText, text,header, buttonSection } from "./styles";

interface WelcomeEmailProps {
  name: string;
  appName: string;
  dashboardUrl: string;
}

export const WelcomeEmail = ({
  name = "User",
  appName = "Ledgerly",
  dashboardUrl = "/",
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {appName}! Your account is ready 🎉</Preview>

      <Body style={main}>
        <Container style={container}>
          <Heading style={header}>Welcome to {appName} 🎉</Heading>

          <Text style={text}>Hi {name},</Text>

          <Text style={text}>
            Your email has been successfully verified and your account is now
            active. We’re excited to have you on board!
          </Text>

          <Section style={buttonSection}>
            <Button href={dashboardUrl} style={button}>
              Go to Dashboard
            </Button>
          </Section>

          <Text style={smallText}>
            If you didn’t create this account, you can safely ignore this
            email.
          </Text>

          <Text style={footer}>
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
