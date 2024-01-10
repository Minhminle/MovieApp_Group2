import React from "react";
import MovieCategory from "@/components/movie/MovieCategory";
import { Box } from "@mui/material";
import ListApp from "@/components/movie/ListApp";
import MovieCard from "@/components/movie/MovieCard";
import MovieItem from "@/components/movie/MovieItem";
import Footter from "@/components/movie/Footer";
const Home: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "black" }}>
      <ListApp />
      <MovieCard />
      <MovieCategory />
      <MovieItem />
        <Footter />
    </Box>
  );
};

export default Home;


