import React from "react";
import MovieCategory from "@/components/movie/MovieCategory";
import { Box } from "@mui/material";
import ListApp from "@/components/movie/ListApp";

const Home: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "black" }}>
      <ListApp />
      <MovieCategory />
    </Box>
  );
};

export default Home;
