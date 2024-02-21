import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Styles } from "@/stylescomponents/style";
import { Contact } from "./sendMail";
type Props = {};
const Footter = (props: Props) => {
  return (
    <>
      <Container sx={{ backgroundColor: "black" }}>
        <Stack direction="column" gap={2}>
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
        <Contact />
      </Container>
    </>
  );
};

export default Footter;
