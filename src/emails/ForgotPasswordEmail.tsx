import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Heading,
  Link,
} from "@react-email/components";
import * as React from "react";
import {
  main,
  button,
  container,
  content,
  expiry,
  footer,
  footerText,
  h2,
  header,
  link,
  logo,
  smallText,
  subtitle,
  text,
} from "./styles";

type Props = {
  name?: string;
  resetUrl: string;
  appName?: string;
};

const ForgotPasswordEmail = ({
  name = "there",
  resetUrl,
  appName = "Ledgerly",
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your {appName} password</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>{appName}</Heading>
            <Text style={subtitle}>Password Reset Request</Text>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Hi {name},
            </Heading>

            <Text style={text}>
              We received a request to reset your password for your{" "}
              <strong>{appName}</strong> account.
            </Text>

            <Text style={text}>
              Click the button below to set a new password.
            </Text>

            <Button href={resetUrl} style={button}>
              Reset Password
            </Button>

            <Text style={smallText}>
              If the button doesn’t work, copy and paste this link into your
              browser:
            </Text>

            <Link href={resetUrl} style={link}>
              {resetUrl}
            </Link>

            <Text style={expiry}>
              This link will expire in 15 minutes for security reasons.
            </Text>

            <Text style={smallText}>
              If you didn’t request a password reset, you can safely ignore this
              email. Your account remains secure.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} {appName}. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ForgotPasswordEmail;
