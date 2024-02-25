import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { NextPageWithLayout } from "@/pages/_app";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
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
  const { data: movieGenres } = useSWR("/genre/movie/list");
  // const genresList: GenreList[] = movieGenres?.genres
  //   ? movieGenres.genres.map((genre: Genre) => [genre])
  //   : [];

  const getGenreNameById = (genreId: number) => {
    // Kiểm tra xem movieGenres có tồn tại và có thuộc tính genres không
    if (movieGenres && movieGenres.genres) {
      const genre = movieGenres.genres.find(
        (g: { id: number }) => g.id === genreId
      );
      return genre ? genre.name : "Unknown Genre";
    }
    // Trả về giá trị mặc định nếu movieGenres không tồn tại hoặc không có thuộc tính genres
    return "Unknown Genre";
  };

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };

  console.log(data);
  if (!data)
    return (
      <div>
        <LinearProgress color="inherit" />
      </div>
    );
  return (
    <>
      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Movies On Awars
      </Typography>
      <Stack
        direction="row"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {data?.results?.map((movie) => (
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
                  {movie.genre_ids?.slice(0, 2).map((genreId, index, array) => (
                    <React.Fragment key={genreId}>
                      {getGenreNameById(genreId)}
                      {index < array.length - 1 && " - "}{" "}
                      {/* Hiển thị dấu phân tách nếu không phải là phần tử cuối cùng */}
                    </React.Fragment>
                  ))}
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
              </Box>
              <Button
                onClick={() => handleDetailClick(movie.id)}
                sx={{
                  backgroundColor: "green",
                  width: "100%",
                  fontSize: "12px",
                  marginTop: "3px",
                }}
                variant="contained"
              >
                Read more
              </Button>
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
