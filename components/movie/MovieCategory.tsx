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

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);

  const { data, isLoading, error } = useSWR<MovieList>(
    `/movie/popular?append_to_response=details`,
    fetcher
  );
  const {
    data: data2,
    isLoading: isLoading2,
    error: error2,
  } = useSWR<MovieList>("/movie/upcoming", fetcher);
  const {
    data: data3,
    isLoading: isLoading3,
    error: error3,
  } = useSWR<MovieList>("/movie/top_rated", fetcher);

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const fetchMovieDetails = async (movieId: string) => {
    const response = await axios.get(`/movie/${movieId}`);
    return response.data;
  };
  useEffect(() => {
    const fetchData = async () => {
      const movies = await fetcher("/movie/popular");
      const movieDetailsPromises = movies.results.map((movie: Movie) =>
        fetchMovieDetails(movie.id)
      );
      const movieDetails = await Promise.all(movieDetailsPromises);
      const moviesWithDetails = movies.results.map(
        (movie: Movie, index: number) => ({
          ...movie,
          genres: movieDetails[index]?.genres,
        })
      );

      setMovieData({ ...movies, results: moviesWithDetails });
    };

    fetchData();
  }, []);
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
              <div style={{ display: "flex", alignItems: "center" }}>
                {movie.genres?.map((genre) => (
                  <Chip key={genre.id} label={genre.name} />
                ))}

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
        sx={{ ..._letterStyles, padding: "10px", marginTop: "-60px" }}
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
