import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import MovieContent from "@/components/movie/MovieContent";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main>
        <Box sx={{ backgroundColor: "black", color: "white" }}>
          <MovieContent />
        </Box>
      </main>
    </>
  );
}
