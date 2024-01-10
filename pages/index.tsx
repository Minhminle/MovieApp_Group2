import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { Box } from "@mui/material";
import ListApp from "@/components/movie/ListApp";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Box sx={{ background: "black" }}>
        <ListApp />
      </Box>
    </>
  );
}
