import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { email, subject, message } = req.body;

      // Tạo một transporter sử dụng SMTP
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "truong.pn.62cntt@ntu.edu.vn", // Gmail của bạn
          pass: "225952268", // Mật khẩu Gmail của bạn
        },
      });

      // Gửi email
      await transporter.sendMail({
        from: "phamngoctruong997@gmail.com", // Địa chỉ email gửi
        to: email, // Địa chỉ email nhận
        subject: "feedBack",
        text: "Hello",
      });

      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "An error occurred while sending email" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
