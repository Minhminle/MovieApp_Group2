import { Box, Container, Stack, Typography } from "@mui/material";
import React from "react";
type Props = {};
const _textfooterStyles = {
  color: "white",
  fontWeight: "500",
};
const socialItem = ["instagram", "facebook", "twitter", "google"];
const menuItem = ["Home", "Discover", "Influence", "Release"];
const policyItem = ["Privacy policy", "Term of Service", "Language"];
function ShowSocialItem(props: { item: string[] }) {
  return (
    <>
      <Stack direction="row" gap={1.5}>
        {props.item.map((item) => (
          <Box
            key={item}
            component="img"
            src={`/icons/${item}.svg`}
            alt=""
            width={30}
            height={30}
          />
        ))}
      </Stack>
    </>
  );
}
function ShowMenuItem(props: { item: string[] }) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        {props.item.map((item) => (
          <Typography sx={{ color: "white" }} variant="h6" key={item}>
            {item}
          </Typography>
        ))}
      </Stack>
    </>
  );
}
function ShowPolicyItem(props: { item: string[] }) {
  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        {props.item.map((item) => (
          <Typography variant="body1" sx={{ color: "gray" }} key={item}>
            {item}
          </Typography>
        ))}
      </Stack>
    </>
  );
}
const Footter = (props: Props) => {
  return (
    <>
      <Container sx={{ pt: "20px" }}>
        <Stack direction="column" gap={2}>
          <Typography sx={_textfooterStyles} variant="h5">
            Our platform is trusted by milions & fearture best updated movies
            all around the world.
          </Typography>
          <ShowSocialItem item={socialItem} />
          <ShowMenuItem item={menuItem} />
          <ShowPolicyItem item={policyItem} />
          <Typography
            sx={{
              color: "gray",
              textAlign: "center",
            }}
          >
            2023
          </Typography>
        </Stack>
      </Container>
    </>
  );
};

export default Footter;
