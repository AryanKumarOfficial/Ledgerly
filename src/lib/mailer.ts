import { baseEnv, smtpEnv } from "@/env";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { ReactElement } from "react";

export const transporter = nodemailer.createTransport({
  service: smtpEnv.service,
  auth: {
    user: smtpEnv.user,
    pass: smtpEnv.password,
  },
});

interface SendEMailOptions {
  to: string;
  subject: string;
  template: ReactElement;
}

export const sendEmail = async ({
  to,
  subject,
  template,
}: SendEMailOptions) => {
  try {
    const emailHtml = await render(template);
    const option = {
      from: `${baseEnv.appName} <${smtpEnv.sender}>`,
      to,
      subject,
      html: emailHtml,
    };

    const result = await transporter.sendMail(option);
    console.log(`Message sent: %s`, result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
