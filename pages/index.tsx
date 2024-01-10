// pages/index.tsx
import React from "react";
import MovieCategory from "@/components/movie/MovieCategory";
import { Box } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "black" }}>
      <MovieCategory></MovieCategory>
    </Box>
  );
};

export default Home;
