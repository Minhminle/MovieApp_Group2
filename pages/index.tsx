// pages/index.tsx
import React from "react";
import { Box } from "@mui/material";
import MovieAward from "@/components/movie/MovieAward";

const Home: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "black" }}>
      <MovieAward></MovieAward>
    </Box>
  );
};

export default Home;
