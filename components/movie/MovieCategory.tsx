import { useRouter } from "next/router";
import { useEffect, type ReactElement, useState } from "react";
import { NextPageWithLayout } from "@/pages/_app";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { Movie, MovieList } from "@/models/Movie";
import { Card, CardContent, CardMedia } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const MovieCategory: NextPageWithLayout = () => {
  const router = useRouter();
  const [movieData, setMovieData] = useState<MovieList | undefined>();
  const { data, isLoading, error } = useSWR<MovieList>(
    `/movie/popular?append_to_response=details`
  );
  const { data: dataGenre } = useSWR("/genre/movie/list");
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useSWR<MovieList>("/movie/top_rated");
  const {
    data: data3,
    isLoading: isLoading3,
    error: error3,
  } = useSWR<MovieList>("/movie/popular");

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
      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Movies
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
            </CardContent>
          </Box>
        ))}
      </Stack>

      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Series
      </Typography>
      <Stack
        direction="row"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {data2?.results.map((movie) => (
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
            </CardContent>
          </Box>
        ))}
      </Stack>

      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Korean Series
      </Typography>
      <Stack
        direction="row"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {data3?.results.map((movie) => (
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
