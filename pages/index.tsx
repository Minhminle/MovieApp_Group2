import React from "react";
import MovieCategory from "@/components/movie/MovieCategory";
import { Box } from "@mui/material";
import ListApp from "@/components/movie/ListApp";
import MovieCard from "@/components/movie/MovieCard";
const Home: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "black" }}>
      <ListApp />
      <MovieCard />
      <MovieCategory />
    </Box>
  );
};

export default Home;
