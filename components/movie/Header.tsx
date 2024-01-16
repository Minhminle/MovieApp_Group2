import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { MovieList, Genre } from "@/models/Movie";

type Props = {};

const Header = (props: Props) => {
  const router = useRouter();

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);

  const { data, isLoading, error } = useSWR<MovieList>(
    "/movie/popular",
    fetcher
  );

  const handleDetailClick = (movieId: string) => {
    router.push(/detail/movie/${movieId});
  };

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);

  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };

  console.log(data);

  return (
    <>
      <Stack gap={4} direction="row" sx={{ overflowX: "auto" }}>
        {data?.results.slice(0, 2).map((movie) => (
          <Stack key={movie.id} spacing={2} sx={{ position: "relative" }}>
            <Stack>
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                width={"390px"}
                onClick={() => handleDetailClick(movie.id)}
              />
            </Stack>
            <Box
              padding={"20px"}
              sx={{
                background:
                  "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                position: "absolute",
                bottom: 0,
                zIndex: 1,
              }}
            >
              <Stack spacing={1}>
                <Box
                  fontSize={"40px"}
                  onClick={() => handleDetailClick(movie.id)}
                >
                  {movie.title}
                </Box>
                <Stack direction={"row"} spacing={2}>
                  <Box sx={{ color: "gray", fontSize: "13px" }}>
                    {movie.release_date}
                  </Box>
                  <Box>
                    {movie.genres?.map((genre) => (
                      <Box key={genre.id}>{genre.name}</Box>
                    ))}
                  </Box>
                </Stack>
                <Box>
                  <Typography>
                    {expandedOverview === movie.overview
                      ? movie.overview
                      : movie.overview.length > 100
                      ? ${movie.overview.slice(0, 100)}...
                      : movie.overview}
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
                  </Typography>
                </Box>
                <Stack direction={"row"} spacing={3}>
                  <Button
                    sx={{
                      backgroundColor: "green",
                      width: "45%",
                      fontSize: "12px",
                    }}
                    variant="contained"
                    startIcon={<PlayCircleFilledIcon />}
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    Watch Trailer
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
              </Stack>
            </Box>
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default Header;