"use server";

import nodemailer from "nodemailer";

const CONTACT_EMAIL = "zjingxiang527@gmail.com";

export type SendContactEmailResult =
  | { success: true }
  | { error: string };

function getStringField(formData: FormData, fieldName: string): string {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function renderTableRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding: 14px 18px; width: 180px; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #e2e8f0;">
        ${escapeHtml(label)}
      </td>
      <td style="padding: 14px 18px; color: #0f172a; font-size: 15px; line-height: 1.6; border-bottom: 1px solid #e2e8f0;">
        ${escapeHtml(value) || "-"}
      </td>
    </tr>
  `;
}

function createEmailHtml(fields: {
  name: string;
  email: string;
  company: string;
  country: string;
  interest: string;
  message: string;
}): string {
  return `
    <!doctype html>
    <html>
      <body style="margin: 0; padding: 0; background: #f8fafc; font-family: Arial, Helvetica, sans-serif;">
        <div style="max-width: 720px; margin: 0 auto; padding: 36px 20px;">
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden;">
            <div style="padding: 28px 30px; background: #0f172a;">
              <p style="margin: 0 0 10px; color: #93c5fd; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.16em;">
                New B2B Inquiry
              </p>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; line-height: 1.3; font-weight: 700;">
                NELYTECH Engineering Contact Request
              </h1>
            </div>

            <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
              ${renderTableRow("Name", fields.name)}
              ${renderTableRow("Work Email", fields.email)}
              ${renderTableRow("Company", fields.company)}
              ${renderTableRow("Country / Region", fields.country)}
              ${renderTableRow("Product Interest", fields.interest)}
            </table>

            <div style="padding: 26px 30px 32px;">
              <p style="margin: 0 0 12px; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
                Project Details
              </p>
              <div style="white-space: pre-line; color: #0f172a; font-size: 16px; line-height: 1.75;">
                ${escapeHtml(fields.message)}
              </div>
            </div>
          </div>

          <p style="margin: 18px 0 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
            This inquiry was submitted through the NELYTECH website contact form.
          </p>
        </div>
      </body>
    </html>
  `;
}

export async function sendContactEmail(formData: FormData): Promise<SendContactEmailResult> {
  const name = getStringField(formData, "name");
  const email = getStringField(formData, "email");
  const company = getStringField(formData, "company");
  const country = getStringField(formData, "country");
  const interest = getStringField(formData, "interest");
  const message = getStringField(formData, "message");

  if (!name || !email || !message) {
    return { error: "Please complete your name, work email, and project details." };
  }

  if (!isValidEmail(email)) {
    return { error: "Please enter a valid work email address." };
  }

  if (process.env.E2E_CONTACT_EMAIL_MOCK === "true") {
    const delayMs = Number(process.env.E2E_CONTACT_EMAIL_MOCK_DELAY_MS ?? "0");

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    return { success: true };
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
  const smtpFrom = process.env.SMTP_FROM ?? smtpUser ?? CONTACT_EMAIL;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return { error: "Email service is not configured. Please contact us directly at contact@nelytech.com." };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subjectCompany = company || "No Company Provided";
  const subject = `New B2B Inquiry from ${name} - ${subjectCompany}`;

  try {
    await transporter.sendMail({
      from: smtpFrom,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject,
      html: createEmailHtml({
        name,
        email,
        company,
        country,
        interest,
        message,
      }),
      text: [
        "New B2B Inquiry",
        "",
        `Name: ${name}`,
        `Work Email: ${email}`,
        `Company: ${company || "-"}`,
        `Country / Region: ${country || "-"}`,
        `Product Interest: ${interest || "-"}`,
        "",
        "Project Details:",
        message,
      ].join("\n"),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email", error);
    return { error: "We could not send your inquiry right now. Please try again later." };
  }
}
