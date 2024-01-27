import { Box } from "@mui/material";
import React from "react";
import MovieCategory from "@/components/movie/MovieCategory";
import ListApp from "@/components/movie/ListApp";
import MovieCard from "@/components/movie/MovieCard";
import MovieItem from "@/components/movie/MovieItem";
import Footter from "@/components/movie/Footer";
import Header from "@/components/movie/Header";
import MovieAward from "@/components/movie/MovieAward";
import MovieRate from "@/components/movie/MovieRate";
import MovieFeature from "@/components/movie/MovieFeature";
import HeaderHome from "@/components/layout_Header/HeaderHome";
const HomePage = () => {
  return(
  <>
    <Box sx={{ position: "absolute", zIndex: "1", top: "20px" }}>
      <HeaderHome />
    </Box>
    <Box
      sx={{ backgroundColor: "black", color: "white", position: "relative" }}
    >
      <Header />
      <ListApp />
      <MovieCard />
      <MovieRate />
      <MovieFeature />
      <MovieCategory />
      <MovieAward />
      <MovieItem />
      <Footter />
      {/* <MovieContent></MovieContent> */}
    </Box>
  </>
  );
};
export default HomePage;
