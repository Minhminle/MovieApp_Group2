import { Image } from "@mui/icons-material";
import { Box, Container, Stack } from "@mui/material";
import React from "react";
const listapp = ["disney", "nextflix", "hbo", "pixar"];
function ShowListApp(props: { item: string[] }) {
  return (
    <>
      <Stack
        sx={{ p: "0px 0px 20px 0px" }}
        direction="row"
        justifyContent="space-between"
      >
        {props.item.map((item, index) => (
          <Box
            component="img"
            key={index}
            src={`/images/${item}.svg`}
            width={50}
            height={50}
          />
        ))}
      </Stack>
    </>
  );
}
const ListApp = () => {
  return (
    <>
      <Container>
        <ShowListApp item={listapp} />
      </Container>
    </>
  );
};
export default ListApp;
