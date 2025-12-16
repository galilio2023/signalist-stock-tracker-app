import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "@/lib/nodemailer/templates";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro,
  );
  const FROM_NAME = process.env.EMAIL_FROM_NAME || "Signalist";
  const FROM_EMAIL =
    process.env.EMAIL_FROM ||
    process.env.NODEMAILER_EMAIL ||
    "no-reply@localhost";
  const mailOptions = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: email,
    subject: `Welcome to Signalist - your stock market toolkit is ready`,
    text: "Thanks for joining signalist",
    html: htmlTemplate,
  };
  await transporter.sendMail(mailOptions);
};
