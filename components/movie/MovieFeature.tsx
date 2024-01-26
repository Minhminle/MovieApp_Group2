import { MovieList } from "@/models/Movie";
import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarIcon from "@mui/icons-material/Star";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import React, { useState } from "react";
import { format } from "date-fns";

const MovieFeature = () => {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<MovieList>("/movie/top_rated");
  const { data: dataGenre } = useSWR("/genre/movie/list");

  console.log(data);

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);

  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };
  const genres = dataGenre?.genres || [];
  return (
    <>
      <Typography
        color="white"
        variant="h4"
        sx={{ ..._letterStyles, padding: "10px" }}
      >
        FeaTured SaintStream
      </Typography>
      <Stack sx={{ overflowX: "auto" }} direction="column">
        <Box>
          <Stack
            gap={4}
            direction="row"
            alignItems="center"
            // Thêm kiểm soát tràn ngang
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
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
                  }
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
                  <Box
                    sx={{
                      flexGrow: 1,
                      color: "white",
                      marginTop: "20px",
                      marginLeft: "5px",
                      fontSize: "20px",
                    }}
                  >
                    {movie.title}
                  </Box>
                  <Stack direction="row" alignItems="center">
                    <StarRateIcon sx={{ color: "yellow" }}></StarRateIcon>
                    <Box sx={{ color: "white" }}>
                      {(movie.vote_average * 0.5).toFixed(1)}/5
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        marginLeft: "5px",
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
                              return foundGenre
                                ? foundGenre.name
                                : "Unknown Genre";
                            })
                            .join(" - ")
                        : "Unknown Genre"}
                    </Typography>
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
        </Box>
        <Box>
          <Stack gap={4} direction="row" sx={{ padding: "19px" }}>
            {data?.results.map((movie) => (
              <Stack key={movie.id}>
                <Box>
                  <Box
                    fontSize={"40px"}
                    sx={{ width: "300px" }}
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
                            .slice(0, 1)
                            .map((genreId) => {
                              const foundGenre = genres.find(
                                (genre) => genre.id === genreId
                              );
                              return foundGenre
                                ? foundGenre.name
                                : "Unknown Genre";
                            })
                            .join(" - ")
                        : "Unknown Genre"}
                    </Typography>
                  </Stack>
                  <Box>
                    <Typography>
                      {expandedOverview === movie.overview
                        ? movie.overview
                        : movie.overview.length > 80
                        ? `${movie.overview.slice(0, 80)}...`
                        : movie.overview}
                    </Typography>
                    {movie.overview.length > 80 && (
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
        </Box>
      </Stack>
    </>
  );
};

export default MovieFeature;
