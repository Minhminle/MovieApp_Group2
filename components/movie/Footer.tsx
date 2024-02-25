import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { Styles } from "@/stylescomponents/style";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";

type Props = {};
const Footer = (props: Props) => {
  const [email, setEmail] = useState(""); // Khai báo và khởi tạo state cho trường email

  const handleSendEmail = async () => {
    try {
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          subject: "Feedback",
          message: "Hello",
        }),
      });
      const data = await response.json();
      console.log(data);
      // Xử lý kết quả từ server nếu cần thiết
    } catch (error) {
      console.error("Error sending email:", error);
      // Xử lý lỗi nếu cần thiết
    }
  };

  return (
    <>
      <Container sx={{ backgroundColor: "black" }}>
        <Stack direction="column" gap={2}>
          <Typography sx={Styles._title} variant="h6">
            Our platform is trusted by millions & features the best updated
            movies all around the world.
          </Typography>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <TextField
              id="email"
              label="Email"
              variant="outlined"
              size="small"
              value={email} // Gán giá trị của trường email từ state
              onChange={(e) => setEmail(e.target.value)} // Gọi hàm setEmail để cập nhật giá trị của email
            />
            <IconButton onClick={handleSendEmail} aria-label="Send Email">
              <EmailIcon />
            </IconButton>
          </Stack>

          <Typography
            sx={{
              color: "gray",
              textAlign: "center",
            }}
          >
            @2024
          </Typography>
        </Stack>
      </Container>
    </>
  );
};

export default Footer;
