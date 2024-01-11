import { MovieList } from "@/models/Movie";
import { Box, Button, Container, Stack } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useRouter } from "next/router";
import React from 'react'



const MovieRate = () => {
  const router = useRouter();
  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);
  const { data, isLoading, error } = useSWR<MovieList>(
    "/movie/popular",
    fetcher
  );
  console.log(data);
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  return (
    <>
      <Box fontSize={"40px"} color={"white"}>
        Popular Of The Week
      </Box>
      <Stack
        gap={4}
        direction="row"
        alignItems="center"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {data?.results.map((movie) => (
          <Stack key={movie.id} direction="row" alignItems="center">
            <Box fontSize={"40px"} color={"white"}>
              1
            </Box>
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              width={200}
              height={200}
              sx={{ borderRadius: "10%" }}
              onClick={() => handleDetailClick(movie.id)}
            />

            <Stack direction="column" alignItems="center">
              <Box sx={{ flexGrow: 1, color: "white", marginTop: "20px" }}>
                {movie.title}
              </Box>
              <Stack direction="row" alignItems="center">
                <Box>
                  <StarRateIcon sx={{ color: "yellow" }}></StarRateIcon>
                </Box>
                <Box sx={{ color: "white" }}>
                  {(movie.vote_average * 0.5).toFixed(1)}/5
                </Box>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </>
  );
}
export default MovieRate;