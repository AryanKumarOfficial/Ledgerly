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
  verifyUrl: string;
  appName?: string;
};

const VerifyEmail = ({
  name = "there",
  verifyUrl = `https://github.com/AryanKumarOfficial/Ledgerly.git`,
  appName = "Ledgerly",
}: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your email to start using {appName}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>{appName}</Heading>
            <Text style={subtitle}>Verify your email address</Text>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Hey {name},
            </Heading>

            <Text style={text}>
              Thanks for signing up! Please confirm your email to activate your
              account and start using <strong>{appName}</strong>.
            </Text>

            <Button href={verifyUrl} style={button}>
              Verify Email
            </Button>

            <Text style={smallText}>
              If the button doesn’t work, copy and paste this link :
            </Text>

            <Link href={verifyUrl} style={link}>
              {verifyUrl}
            </Link>

            <Text style={expiry}>This link will expire in 15 minutes.</Text>
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

export default VerifyEmail;
