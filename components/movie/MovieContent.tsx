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
import { Movie } from "@/models/Movie";

const MovieContent: NextPageWithLayout = () => {
  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);
  const { data, isLoading, error } = useSWR("/genre/movie/list", fetcher);
  const {
    data: dataMovies,
    isLoading: isLoading2,
    error: error2,
  } = useSWR<MovieList>("/movie/upcoming", fetcher);

  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading genres</div>;

  const genres = data?.genres || [];
  const movies = dataMovies?.results || [];
  return (
    <>
      <Stack>
        {movies.map((movie: Movie) => (
          <Card
            key={movie.id}
            sx={{
              margin: "10px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                Tên phim: {movie.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#42a5f5" }}>
                ID phim: {movie.id}
              </Typography>
              <Typography variant="body2" sx={{ color: "#42a5f5" }}>
                Thể loại:{" "}
                {movie.genre_ids && movie.genre_ids.length > 0
                  ? movie.genre_ids
                      .map((genreId) => {
                        const foundGenre = genres.find(
                          (genre) => genre.id === genreId
                        );
                        return foundGenre ? foundGenre.name : "Unknown Genre";
                      })
                      .join(", ")
                  : "Unknown Genre"}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
      {/* 
      <Box>Genre: {genres.map((genre: Genre) => genre.name).join(", ")}</Box> */}
    </>
  );
};

MovieContent.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieContent;
