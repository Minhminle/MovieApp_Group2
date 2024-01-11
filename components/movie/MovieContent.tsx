import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import React from "react";
import StarIcon from "@mui/icons-material/Star";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { MovieList } from "@/models/Movie";

type Props = {};

const MovieContent = (props: Props) => {
  const router = useRouter();

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);

  const { data, isLoading, error } = useSWR<MovieList>(
    "/movie/popular",
    fetcher
  );

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  console.log(data);
  return (
    <>
      <Stack gap={4} direction="row" sx={{ overflowX: "auto" }}>
        {data?.results.map((movie) => (
          <Stack key={movie.id}>
            <Box fontSize={"30px"} onClick={() => handleDetailClick(movie.id)}>
              {movie.title}
            </Box>
            <Stack direction={"row"} spacing={2}>
              <StarIcon sx={{ color: "yellow" }} className="star-icon" />
              <Box>{movie.vote_average}</Box>
              <Box>{movie.release_date}</Box>
              <Box>
                <Typography>genre</Typography>
              </Box>
            </Stack>
            <Box>{movie.overview}</Box>
            <Stack direction={"row"} spacing={3}>
              <Button
                onClick={() => handleDetailClick(movie.id)}
                sx={{ backgroundColor: "green", width: "50%" }}
                variant="contained"
                startIcon={<AddCircleIcon />}
              >
                Play Now
              </Button>
              <Button
                color="inherit"
                sx={{ width: "50%" }}
                variant="outlined"
                startIcon={<TurnedInNotIcon />}
              >
                Add watchlist
              </Button>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default MovieContent;
