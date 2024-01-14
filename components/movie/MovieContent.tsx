import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
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
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);

  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };
  console.log(data);
  return (
    <>
      <Stack
        gap={4}
        direction="row"
        sx={{ overflowX: "auto", padding: "19px" }}
      >
        {data?.results.slice(0, 2).map((movie) => (
          <Stack key={movie.id}>
            <Box>
              <Box
                fontSize={"40px"}
                sx={{ width: "350px" }}
                onClick={() => handleDetailClick(movie.id)}
              >
                {movie.title}
              </Box>
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <StarIcon sx={{ color: "yellow" }} className="star-icon" />
                <Box
                  sx={{
                    borderRight: "solid",
                    color: "gray",
                    width: "45px",
                    height: "15px",
                  }}
                >
                  {movie.vote_average}
                </Box>
                <Box sx={{ color: "gray" }}>{movie.release_date}</Box>
                {/* <Box>
                  <Typography>genre</Typography>
                </Box> */}
              </Stack>
              <Box>
                <Typography>
                  {expandedOverview === movie.overview
                    ? movie.overview
                    : movie.overview.length > 100
                    ? `${movie.overview.slice(0, 100)}...`
                    : movie.overview}
                </Typography>
                {movie.overview.length > 100 && (
                  <Button
                    sx={{ fontSize: "12px", color: "green" }}
                    onClick={() => toggleText(movie.overview)}
                  >
                    {expandedOverview === movie.overview
                      ? "Read less"
                      : "Read more"}
                  </Button>
                )}
              </Box>
              <Stack direction={"row"} spacing={3}>
                <Button
                  onClick={() => handleDetailClick(movie.id)}
                  sx={{
                    backgroundColor: "green",
                    width: "45%",
                    fontSize: "12px",
                  }}
                  variant="contained"
                  startIcon={<PlayCircleFilledIcon />}
                >
                  Play Now
                </Button>
                <Button
                  color="inherit"
                  sx={{ width: "45%", fontSize: "12px" }}
                  variant="outlined"
                  startIcon={<TurnedInNotIcon />}
                >
                  Add watchlist
                </Button>
              </Stack>
            </Box>
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default MovieContent;
