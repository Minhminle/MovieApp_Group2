import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Box } from "@mui/material";
import MovieItem from "@/components/movie/MovieItem";
import Footter from "@/components/movie/Footer";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Box sx={{ background: "black" }}>
        <MovieItem />
        <Footter />
      </Box>
    </>
  );
}
