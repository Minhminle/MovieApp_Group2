import { MovieList } from "@/models/Movie";
import { GenreList } from "@/models/Movie";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import useSWR from "swr";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";

const MovieRate = () => {
  const router = useRouter();
  const { data } = useSWR<MovieList>("/movie/popular");
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

  console.log(data);
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  if (!data)
    return (
      <div>
        <LinearProgress color="inherit" />
      </div>
    );
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  return (
    <>
      <Typography
        sx={_letterStyles}
        variant="h4"
        color={"white"}
        padding={"10px"}
      >
        Popular Of The Week
      </Typography>
      <Stack
        gap={4}
        padding={"10px"}
        direction="row"
        alignItems="center"
        sx={{ overflowX: "auto" }}
      >
        {data?.results?.map((movie, index) => (
          <Stack key={movie.id} direction="row" alignItems="center" spacing={1}>
            <Typography variant="h3" color="white" padding={"3px"}>
              {index + 1}
            </Typography>
            <Box
              component="img"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
              }
              width={200}
              height={300}
              sx={{ borderRadius: "50px" }}
              onClick={() => handleDetailClick(movie.id)}
            />
            <Stack direction="column">
              <Box
                sx={{
                  marginLeft: "5px",
                  color: "white",
                  marginTop: "20px",
                }}
                onClick={() => handleDetailClick(movie.id)}
              >
                {expandedOverview === movie.title
                  ? movie.title
                  : movie.title.length > 15
                  ? `${movie.title.slice(0, 15)}...`
                  : movie.title}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  marginLeft: "5px",
                  color: "#9e9e9e",
                  fontSize: "15px",
                  width: "100px",
                }}
              >
                {movie.genre_ids?.slice(0, 2).map((genreId, index, array) => (
                  <React.Fragment key={genreId}>
                    {getGenreNameById(genreId)}
                    {index < array.length - 1 && " - "}{" "}
                    {/* Hiển thị dấu phân tách nếu không phải là phần tử cuối cùng */}
                  </React.Fragment>
                ))}
              </Typography>
              <Stack direction="row" alignItems="center">
                <Box>
                  <StarRateIcon sx={{ color: "yellow" }}></StarRateIcon>
                </Box>
                <Box sx={{ color: "white" }}>
                  {(movie.vote_average * 0.5).toFixed(1)}/5
                </Box>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </>
  );
};
export default MovieRate;
