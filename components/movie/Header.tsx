import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react"; // Import useState
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { MovieList } from "@/models/Movie";
import { format } from "date-fns";

type Props = {};

const Header = (props: Props) => {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<MovieList>("/movie/popular");
  const { data: dataGenre } = useSWR("/genre/movie/list");

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);

  // const toggleText = (overview: string) => {
  //   setExpandedOverview((prev) => (prev === overview ? null : overview));
  // };

  console.log(data);
  const genres = dataGenre?.genres || [];
  return (
    <>
      <Box>
        <Stack gap={4} direction="row" sx={{ overflowX: "auto" }}>
          {data?.results.slice(0, 2).map((movie) => (
            <Stack key={movie.id} spacing={2} sx={{ position: "relative" }}>
              <Stack>
                <Box
                  component="img"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
                  }
                  width={"auto"}
                  height={"560px"}
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
                    sx={_letterStyles}
                    fontSize={"40px"}
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    {expandedOverview === movie.title
                      ? movie.title
                      : movie.title.length > 15
                      ? `${movie.title.slice(0, 15)}...`
                      : movie.title}
                  </Box>
                  <Stack direction={"row"} spacing={2}>
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
                        : movie.overview.length > 90
                        ? `${movie.overview.slice(0, 90)}...`
                        : movie.overview}
                      {movie.overview.length > 90 && (
                        <Button
                          sx={{ fontSize: "12px", color: "green" }}
                          onClick={() => handleDetailClick(movie.id)}
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
                      sx={{ backgroundColor: "green", width: "50%" }}
                      variant="contained"
                      startIcon={<AddCircleIcon />}
                      onClick={() => handleDetailClick(movie.id)}
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
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default Header;
