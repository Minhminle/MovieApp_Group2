import { useRouter } from "next/router";
import type { ReactElement } from "react";
import { NextPageWithLayout } from "@/pages/_app";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import axios from "axios";
import useSWR from "swr";
import { MovieList } from "@/models/Movie";
import { Card, CardContent, CardMedia } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const MovieCategory: NextPageWithLayout = () => {
  const router = useRouter();

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);

  const { data, isLoading, error } = useSWR<MovieList>(
    "/movie/upcoming?append_to_response=images",
    fetcher
  );

  console.log(data);
  return (
    <>
      <Stack>
        {data?.results.map((movie) => (
          <Card
            key={movie.id}
            sx={{ margin: "15px", backgroundColor: "black", color: "white" }}
          >
            <CardMedia
              style={{
                borderRadius: "20px",
              }}
              component="img"
              alt={movie.title}
              height="200px"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
            <CardContent>
              <Typography variant="h5" component="div">
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
          </Card>
        ))}
      </Stack>
    </>
  );
};

MovieCategory.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieCategory;
