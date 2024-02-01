import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

const oauth2Client = new OAuth2Client(
  "1081771036819-j9mhmmj4j2si9vg237d16i3on8k67516.apps.googleusercontent.com",
  "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",
  "http://localhost:3000"
);

export const sendEmail = async (
  emailAddress: string,
  subject: string,
  body: string
) => {
  try {
    // Thực hiện xác thực OAuth và lấy access token
    const { tokens } = await oauth2Client.getToken("AUTHORIZATION_CODE");

    // Sử dụng access token để gửi email thông qua Gmail API
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const emailContent = `To: ${emailAddress}\r\nSubject: ${subject}\r\n\r\n${body}`;
    const raw = Buffer.from(emailContent).toString("base64");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
      },
    });

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
