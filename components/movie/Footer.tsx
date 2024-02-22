import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { Styles } from "@/stylescomponents/style";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import { Contact } from "../sendMail";
type Props = {};
const Footter = (props: Props) => {
  const [email, setEmail] = useState("");
  return (
    <>
      <Container sx={{ backgroundColor: "black" }}>
        <Stack direction="column" gap={2}>
          {" "}
          <Contact />
          <Typography sx={Styles._title} variant="h6">
            Our platform is trusted by milions & fearture best updated movies
            all around the world.
          </Typography>
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
