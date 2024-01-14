import React from "react";
import MovieCategory from "@/components/movie/MovieCategory";
import { Box } from "@mui/material";
import ListApp from "@/components/movie/ListApp";
import MovieCard from "@/components/movie/MovieCard";
import MovieItem from "@/components/movie/MovieItem";
import Footter from "@/components/movie/Footer";
import Header from "@/components/movie/Header";
import MovieAward from "@/components/movie/MovieAward";
import MovieContent from "@/components/movie/MovieContent";
import MovieRate from "@/components/movie/MovieRate";
import MovieFeature from "@/components/movie/MovieFeature";
const Home: React.FC = () => {
  return (
    <Box sx={{ backgroundColor: "black", color: "white" }}>
      <MovieFeature></MovieFeature>
    
    </Box>
  );
};
export default Home;
