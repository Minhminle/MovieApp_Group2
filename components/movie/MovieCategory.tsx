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
  } = useSWR<MovieList>("/movie/upcoming");
  const {
    data: data3,
    isLoading: isLoading3,
    error: error3,
  } = useSWR<MovieList>("/movie/top_rated");

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const genres = dataGenre?.genres || [];
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
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                onClick={() => handleDetailClick(movie.id)}
              >
                {movie.title}
              </Typography>
              <Stack direction={"row"}>
                <div
                  style={{
                    marginTop: "5px",
                    marginRight: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StarIcon style={{ marginRight: "4px", color: "#ffeb3b" }} />
                  <Typography variant="body2">{movie.vote_average}</Typography>
                </div>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9e9e9e",
                    marginRight: "65px",
                    fontSize: "15px",
                    marginTop: "5px",
                  }}
                >
                  |{" "}
                  {movie.genre_ids && movie.genre_ids.length > 0
                    ? movie.genre_ids
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

      <Typography
        variant="h4"
        sx={{ ..._letterStyles, padding: "10px", marginTop: "-70px" }}
      >
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
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                onClick={() => handleDetailClick(movie.id)}
              >
                {movie.title}
              </Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* genre here */}
                <div
                  style={{
                    marginTop: "5px",
                    marginRight: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StarIcon style={{ marginRight: "4px", color: "#ffeb3b" }} />
                  <Typography variant="body2">{movie.vote_average}</Typography>
                </div>
              </div>
            </CardContent>
          </Box>
        ))}
      </Stack>

      <Typography
        variant="h4"
        sx={{ ..._letterStyles, padding: "10px", marginTop: "-30px" }}
      >
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
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                onClick={() => handleDetailClick(movie.id)}
              >
                {movie.title}
              </Typography>
              <div style={{ display: "flex", alignItems: "center" }}>
                {/* genre here */}
                <div
                  style={{
                    marginTop: "5px",
                    marginRight: "auto",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StarIcon style={{ marginRight: "4px", color: "#ffeb3b" }} />
                  <Typography variant="body2">{movie.vote_average}</Typography>
                </div>
              </div>
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
