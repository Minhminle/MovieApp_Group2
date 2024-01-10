import { Box, Stack, Typography } from "@mui/material";
import React from "react";

type Props = {};

const MovieContent = (props: Props) => {
  return (
    <Box>
      <Stack>
        <Typography>Title</Typography>
        <Typography>Overview</Typography>
      </Stack>
    </Box>
  );
};

export default MovieContent;
