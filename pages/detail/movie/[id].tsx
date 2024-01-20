import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import React, { useState } from "react";
import { Reviews, ListReview } from "@/models/Reviews";
import { format } from "date-fns";
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

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

const MovieDetail = () => {
  const [visibleReviews, setVisibleReviews] = useState(5); // Số lượng đánh giá hiển thị ban đầu

  const loadMoreReviews = () => {
    setVisibleReviews((prevVisibleReviews) => prevVisibleReviews + 5); // Tăng số lượng đánh giá hiển thị thêm 5
  };

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);
  const { data, error } = useSWR<Movie>(
    `/movie/${id}?append_to_response=credits,`,
    fetcher
  );
  const { data: datareview } = useSWR(`/movie/${id}/reviews`);

  if (error) return <div>Error loading movie details</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <>
      <Stack gap={4} sx={{ backgroundColor: "black", color: "white" }}>
        <Box
          component="img"
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
          alt={data.title}
          style={{
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
          }}
        />
        <Box
          sx={{
            margin: "20px",
          }}
        >
          <Typography variant="h3" sx={{}}>
            {data.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: "18px", color: "#555", marginBottom: "20px" }}
          >
            {data.overview}
          </Typography>
          <Stack direction={"row"}>
            <Rating
              name="movie-rating"
              value={data.vote_average ? data.vote_average / 2 : 0}
              precision={0.5}
              readOnly
              sx={{ color: "#FFD700", fontSize: 24 }}
            />
            <Stack direction="row" spacing={3}>
              <Typography variant="h6" sx={{ color: "yellow" }}>
                {(data.vote_average * 0.5).toFixed(1)}
              </Typography>
              <Typography variant="h5" sx={{ color: "#d32f2f" }}>
                Votes: {data.vote_count}
              </Typography>
            </Stack>
          </Stack>
          <Typography variant="h5" sx={{ color: "#42a5f5", marginTop: "10px" }}>
            Genres:
            {data.genres?.map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                sx={{
                  margin: "3px",
                  backgroundColor: "#673ab7",
                  color: "white",
                  marginRight: "5px",
                  marginBottom: "5px",
                }}
              />
            ))}
          </Typography>
          {/* <Typography variant="h5" sx={{ color: "#1de9b6", marginTop: "10px" }}>
            Cast:

            {data.credits?.cast?.slice(0, 5).map((actor) => (
              <Chip
                key={actor.id}
                label={`${actor.name} as ${actor.character}`}
                sx={{
                  margin: "3px",
                  backgroundColor: "#66bb6a",
                  color: "white",
                  marginRight: "5px",
                  marginBottom: "5px",
                }}
              />
            ))}
          </Typography> */}
          <Typography variant="h5" sx={{ color: "#1de9b6", marginTop: "10px" }}>
            Top Cast:
            <Stack
              gap={2}
              direction="row"
              alignItems="center"
              sx={{ overflowX: "auto" }}
            >
              {data.credits?.cast?.map((actor) => (
                <Stack key={actor.id}>
                  <Box
                    sx={{
                      color: "white",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <Stack direction="row" alignItems="center">
                      <Avatar
                        src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                        alt={actor.name}
                        sx={{
                          marginRight: "10px",
                          width: "80px",
                          height: "80px",
                        }}
                      />
                      <Box width="100px">
                        <Typography sx={{ fontWeight: "bold" }}>
                          {expandedOverview === actor.name
                            ? actor.name
                            : actor.name.length > 15
                            ? `${actor.name.slice(0, 15)}...`
                            : actor.name}
                        </Typography>
                        <Typography
                          color="gray"
                          variant="body2"
                          sx={{ fontWeight: "bold" }}
                        >
                          {expandedOverview === actor.character
                            ? actor.character
                            : actor.character.length > 15
                            ? `${actor.character.slice(0, 15)}...`
                            : actor.character}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Typography>
        </Box>
      </Stack>
      <Stack gap={2} direction="column" alignItems="center">
        {datareview?.results.slice(0, visibleReviews).map((review) => (
          <Stack key={review.id}>
            <Box color="white">{review.author}</Box>
            <Box>
              <Avatar
                src={`https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}`}
                sx={{
                  marginRight: "10px",
                  width: "80px",
                  height: "80px",
                }}
              />
            </Box>
            <Box color="white">{review.content}</Box>
            <Box color="white">
              {format(new Date(review.updated_at), "dd/MM/yyyy HH:mm:ss")}
            </Box>
          </Stack>
        ))}
        {datareview?.results.length > visibleReviews && (
          <Box>
            <button onClick={loadMoreReviews}>Load More</button>
          </Box>
        )}
      </Stack>
      <Footter></Footter>
    </>
  );
};

MovieDetail.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieDetail;
