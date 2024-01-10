import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import MovieCard from '@/components/movie/MovieCard'
import { Box, Container } from '@mui/material'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Box sx={{ background: "black" }}>
       
          <MovieCard/>
       
      </Box>
    </>
  );
}
