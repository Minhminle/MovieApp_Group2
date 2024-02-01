import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { Styles } from "@/stylescomponents/style";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
type Props = {};
const Footter = (props: Props) => {
  const [email, setEmail] = useState("");
  return (
    <>
      <Container sx={{ backgroundColor: "black" }}>
        <Stack direction="column" gap={2}>
          <Typography sx={Styles._title} variant="h6">
            Our platform is trusted by milions & fearture best updated movies
            all around the world.
          </Typography>
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <EmailIcon sx={{ color: "green", fontSize: "45px" }}></EmailIcon>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Box
                component="form"
                sx={{
                  width: "100%",
                  backgroundColor: "#454545",

                  borderRadius: "25px",
                  "& .MuiInputLabel-root": {
                    // Chọn label
                    color: "lightgray", // Đổi màu chữ label thành màu đỏ
                  },
                }}
              >
                <TextField
                  id="filled-basic"
                  label="Email Adress"
                  variant="filled"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    style: { color: "white" }, // Đặt màu chữ khi nhập vào
                  }}
                />
              </Box>
              {email && (
                <IconButton aria-label="SendIcon">
                  <SendIcon sx={{ color: "yellowgreen", fontSize: "40px" }} />
                </IconButton>
              )}
            </Stack>
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

export default Footter;
