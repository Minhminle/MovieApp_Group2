import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Header from "@/components/movie/Header";
import { Box } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <main>
        <Box sx={{ backgroundColor: "black", color: "white" }}>
          <Header />
        </Box>
      </main>
    </>
  );
}
