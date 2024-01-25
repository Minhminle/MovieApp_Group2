import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";
import { Movie } from "@/models/Movie";
import Footter from "@/components/movie/Footer";
import DetailHeader from "@/components/movie/DeatailHeader";
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
    `/movie/${id}?append_to_response=credits`
  );
  const { data: similarMoviesData, error: similarMoviesError } = useSWR(
    `/movie/${id}/similar`
  );
  const { data: MoviesLists, error: listsMoviesError } = useSWR(
    `/movie/${id}/lists`
  );
  const { data: dataVideo } = useSWR(`/movie/${id}/videos`);
  const { data: datareview } = useSWR(`/movie/${id}/reviews`);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === dataVideo?.results.length - 1 ? 0 : prevIndex + 1
    );
  };

  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h${remainingMinutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (remainingMinutes > 0) {
      return `${remainingMinutes}m`;
    }

    return "";
  };
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const [isThumbUpPressed, setIsThumbUpPressed] = useState(false);
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleThumbUp = () => {
    setIsThumbUpPressed((prev) => !prev);
  };
  const [isTurnedInPressed, setIsTurnedInPressed] = useState(false);

  const handleTurnedIn = () => {
    setIsTurnedInPressed((prev) => !prev);
  };
  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? dataVideo?.results.length - 1 : prevIndex - 1
    );
  };
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };

  const [visibleReviews, setVisibleReviews] = useState(2); // Số lượng đánh giá hiển thị ban đầu

  const loadMoreReviews = () => {
    setVisibleReviews((prevVisibleReviews) => prevVisibleReviews + 2); // Tăng số lượng đánh giá hiển thị thêm 5
  };
  const handleDetailCastClick = (actorid: number) => {
    router.push(`/detail/cast/${actorid}`);
  };

  if (error) return <div>Error loading movie details</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <DetailHeader></DetailHeader>
      <Typography variant="h5" sx={{ color: "#1de9b6", marginTop: "10px" }}>
        <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
          Top Cast
        </Typography>
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
                <Box color="white">{actor.id}</Box>
                <Stack direction="row" alignItems="center">
                  <Avatar
                    src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    alt={actor.name}
                    sx={{
                      marginRight: "10px",
                      width: "80px",
                      height: "80px",
                    }}
                    onClick={() => handleDetailCastClick(actor.id)}
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
      <Footter />
    </>
  );
};

MovieDetail.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieDetail;
