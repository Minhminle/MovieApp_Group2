import { useRouter } from "next/router";
import { useEffect, type ReactElement, useState } from "react";
import { NextPageWithLayout } from "@/pages/_app";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
// import axios from "axios";
import useSWR from "swr";
import { Movie, MovieList } from "@/models/Movie";
import { Card, CardContent, CardMedia } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import React from "react";

const MovieCategory: NextPageWithLayout = () => {
  const router = useRouter();
  const [movieData, setMovieData] = useState<MovieList | undefined>();
  const { data, isLoading, error } = useSWR<MovieList>(
    `/movie/top_rated?append_to_response=details`
  );
  const { data: movieGenres } = useSWR("/genre/movie/list");
  // const genresList: GenreList[] = movieGenres?.genres
  //   ? movieGenres.genres.map((genre: Genre) => [genre])
  //   : [];
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useSWR<MovieList>("/movie/popular");

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
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

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  if (!data && !data2)
    return (
      <div>
        <LinearProgress color="inherit" />
      </div>
    );
  return (
    <>
      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Movies Top Rate
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
                borderRadius: "20px",
                height: "180px",
                width: "300px",
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
              <Typography
                variant="h5"
                component="div"
                onClick={() => handleDetailClick(movie.id)}
              >
                {expandedOverview === movie.title
                  ? movie.title
                  : movie.title.length > 15
                  ? `${movie.title.slice(0, 15)}...`
                  : movie.title}
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StarIcon style={{ marginRight: "4px", color: "#ffeb3b" }} />
                  <Typography variant="body2">
                    {(movie.vote_average * 0.5).toFixed(1)}
                  </Typography>
                </div>
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
            </CardContent>
          </Box>
        ))}
      </Stack>

      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Movies Popular
      </Typography>
      <Stack
        direction="row"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {data2?.results?.map((movie) => (
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
                borderRadius: "20px",
                height: "180px",
                width: "300px",
              }}
              onClick={() => handleDetailClick(movie.id)}
              component="img"
              alt={movie.title}
              image={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
            />
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                onClick={() => handleDetailClick(movie.id)}
              >
                {expandedOverview === movie.title
                  ? movie.title
                  : movie.title.length > 15
                  ? `${movie.title.slice(0, 15)}...`
                  : movie.title}
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StarIcon style={{ marginRight: "4px", color: "#ffeb3b" }} />
                  <Typography variant="body2">
                    {(movie.vote_average * 0.5).toFixed(1)}
                  </Typography>
                </div>
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
            </CardContent>
          </Box>
        ))}
      </Stack>
    </>
  );
};

MovieCategory.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};
export default MovieCategory;
