import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { NextPageWithLayout } from "@/pages/_app";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { MovieList } from "@/models/Movie";
import { Card, CardContent, CardMedia } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import React, { useState } from "react";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { format } from "date-fns";

const MovieAward: NextPageWithLayout = () => {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<MovieList>("/movie/top_rated");
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };
  const { data: dataGenre } = useSWR("/genre/movie/list");

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };

  console.log(data);
  const genres = dataGenre?.genres || [];
  return (
    <>
      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Movies On Awars
      </Typography>
      <Stack
        direction="row"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {data?.results.map((movie) => (
          <Box
            key={movie.id}
            sx={{
              margin: "10px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <CardMedia
              style={{
                height: "180px",
                width: "355px",
              }}
              onClick={() => handleDetailClick(movie.id)}
              component="img"
              alt={movie.title}
              image={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                  : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
              }
            />
            <CardContent>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "30px",
                  color: "white",
                  borderColor: "white",
                }}
              >
                Best Pictures
              </Button>
            </CardContent>
            <Box>
              <Box
                fontSize={"40px"}
                sx={{ width: "350px" }}
                onClick={() => handleDetailClick(movie.id)}
              >
                {expandedOverview === movie.title
                  ? movie.title
                  : movie.title.length > 10
                  ? `${movie.title.slice(0, 10)}...`
                  : movie.title}
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
                  {(movie.vote_average * 0.5).toFixed(1)}
                </Box>
                <Box sx={{ paddingTop: "2px" }}>
                  {format(new Date(movie.release_date), "dd/MM/yyyy")}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9e9e9e",
                    fontSize: "15px",
                  }}
                >
                  |{" "}
                  {movie.genre_ids && movie.genre_ids.length > 0
                    ? movie.genre_ids
                        .slice(0, 2)
                        .map((genreId) => {
                          const foundGenre = genres.find(
                            (genre) => genre.id === genreId
                          );
                          return foundGenre ? foundGenre.name : "Unknown Genre";
                        })
                        .join(" - ")
                    : "Unknown Genre"}
                </Typography>
              </Stack>
              <Box>
                <Typography>
                  {expandedOverview === movie.overview
                    ? movie.overview
                    : movie.overview.length > 90
                    ? `${movie.overview.slice(0, 90)}...`
                    : movie.overview}
                </Typography>
                {movie.overview.length > 90 && (
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
          </Box>
        ))}
      </Stack>
    </>
  );
};

MovieAward.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieAward;
