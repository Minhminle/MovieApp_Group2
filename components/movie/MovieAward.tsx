import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { NextPageWithLayout } from "@/pages/_app";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { MovieList } from "@/models/Movie";
import { Card, CardContent, CardMedia } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const MovieAward: NextPageWithLayout = () => {
  const router = useRouter();

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);

  const { data, isLoading, error } = useSWR<MovieList>(
    "/movie/popular",
    fetcher
  );

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  console.log(data);
  return (
    <>
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
                height: "180px",
                width: "355px",
              }}
              onClick={() => handleDetailClick(movie.id)}
              component="img"
              alt={movie.title}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
            <CardContent>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: "30px",
                  color: "white",
                  borderColor: "white",
                }}
              >
                Best Pictures
              </Button>
            </CardContent>
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
