import { MovieList } from "@/models/Movie";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useRouter } from "next/router";
import React from "react";

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

  const Counter = ({ count }) => {
    const numbers = [];
    for (let i = 1; i <= count; i++) {
      numbers.push(i);
    }
    return (
      <>
        <>
          {numbers.map((number) => (
            <Typography key={number}>{number}</Typography>
          ))}
        </>
      </>
    );
  };
  const movieCount = data?.results.length;
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  return (
    <>
      <Typography
        sx={_letterStyles}
        variant="h4"
        color={"white"}
        padding={"10px"}
      >
        Popular Of The Week
      </Typography>
      <Stack
        gap={4}
        padding={"10px"}
        direction="row"
        alignItems="center"
        sx={{ overflowX: "auto" }}
      >
        {data?.results.map((movie, index) => (
          <Stack key={movie.id} direction="row" alignItems="center">
            <Typography variant="h3" color="white" padding={"3px"}>
              {index + 1}
            </Typography>
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              width={200}
              height={200}
              sx={{ borderRadius: "10%" }}
              onClick={() => handleDetailClick(movie.id)}
            />
            <Stack direction="column" alignItems="center">
              <Box
                sx={{
                  padding: "5px",
                  flexGrow: 1,
                  color: "white",
                  marginTop: "20px",
                }}
              >
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
};
export default MovieRate;
