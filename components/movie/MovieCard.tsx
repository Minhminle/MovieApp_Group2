import { MovieList } from "@/models/Movie";
import {
  Box,
  Button,
  CardMedia,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useRouter } from "next/router";
import { useState } from "react";
import { format } from "date-fns";

const MovieCard = () => {
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
  const genres = dataGenre?.genres || [];
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
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
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
              }
              width={300}
              height={500}
              sx={{ borderRadius: "50px" }}
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
                onClick={() => handleDetailClick(movie.id)}
              >
                {expandedOverview === movie.title
                  ? movie.title
                  : movie.title.length > 15
                  ? `${movie.title.slice(0, 15)}...`
                  : movie.title}
              </Box>
              <Stack direction="row" alignItems="center">
                <StarRateIcon sx={{ color: "yellow" }}></StarRateIcon>
                <Box sx={{ color: "white" }}>
                  {(movie.vote_average * 0.5).toFixed(1)}/5
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9e9e9e",
                    fontSize: "15px",
                    marginLeft: "5px",
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
};

export default MovieCard;
