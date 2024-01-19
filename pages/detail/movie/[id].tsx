import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";
import { Movie } from "@/models/Movie";
import { Rating, Chip } from "@mui/material";
import Footter from "@/components/movie/Footer";
import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

const MovieDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR<Movie>(
    `/movie/${id}?append_to_response=credits,similar`
  );
  const { data: similarMoviesData, error: similarMoviesError } = useSWR(
    `/movie/${id}/similar`
  );
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);

  if (error) return <div>Error loading movie details</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <>
      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Similar Movies:
      </Typography>

      <Stack
        direction="row"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {similarMoviesData?.results.map((movie) => (
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
                onClick={() => handleDetailClick(movie.id)}
              >
                {expandedOverview === movie.title
                  ? movie.title
                  : movie.title.length > 15
                  ? `${movie.title.slice(0, 15)}...`
                  : movie.title}
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StarIcon style={{ marginRight: "4px", color: "#ffeb3b" }} />
                  <Typography variant="body2">
                    {(movie.vote_average * 0.5).toFixed(1)}
                  </Typography>
                </Box>

                {data.genres?.map((genre) => (
                  <Typography
                    key={genre.id}
                    variant="h6"
                    style={{ marginTop: "-1px" }}
                    sx={{ color: "#9e9e9e" }}
                  >
                    {genre.name}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Box>
        ))}
      </Stack>
    </>
  );
};

MovieDetail.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieDetail;
