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
    "/movie/upcoming",
    fetcher
  );
  return (
    <>
      <Stack gap={4}>
        {data?.results.map((movie) => (
          <Stack key={movie.id}>
            <Box fontSize={"30px"}>{movie.title}</Box>
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
                sx={{ backgroundColor: "green" }}
                variant="contained"
                startIcon={<AddCircleIcon />}
              >
                Play Now
              </Button>
              <Button
                color="inherit"
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
