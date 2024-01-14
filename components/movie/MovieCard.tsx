
import { MovieList } from '@/models/Movie';
import { Box, Button, Container, Stack } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import React from 'react'
import useSWR from 'swr';
import StarRateIcon from "@mui/icons-material/StarRate";
import { useRouter } from 'next/router';

const MovieCard = () => {
  const router = useRouter();
    const fetcher = (url: string) =>
      axios.get(url).then((response) => response.data);
    const { data, isLoading, error } = useSWR<MovieList>(
      "/movie/upcoming",
      fetcher
    );
    console.log(data);
    const handleDetailClick = (movieId: string) => {
      router.push(`/detail/movie/${movieId}`);
    };


  return (
    <>
      <Stack
        gap={4}
        direction="row"
        alignItems="center"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {data?.results.map((movie) => (
          <Stack
            key={movie.id}
            direction="column"
            alignItems="center"
            position={"relative"}
          >
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              width={300}
              height={500}
              sx={{ borderRadius: "10%" }}
              onClick={() => handleDetailClick(movie.id)}
            />
            <Box
              position={"absolute"}
              zIndex={"1"}
              bottom={"20px"}
              left={"30px"}
            >
              <Box sx={{ flexGrow: 1, color: "white", marginTop: "20px", marginLeft:"5px", fontSize:"20px"}}>
                {movie.title}
              </Box>
              <Stack direction="row" alignItems="center">
                <StarRateIcon sx={{ color: "yellow" }}></StarRateIcon>
                <Box sx={{ color: "white" }}>
                  {(movie.vote_average * 0.5).toFixed(1)}/5
                </Box>
              </Stack>
            </Box>
            <Box
              position={"absolute"}
              zIndex={"0"}
              top={"400px"}
              sx={{
                background:
                  "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                width: "350px",
                height: "100px",
              }}
            ></Box>
          </Stack>
        ))}
      </Stack>
    </>
  );
 
  
}

export default MovieCard

