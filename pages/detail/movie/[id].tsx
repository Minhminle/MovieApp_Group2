import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import ReactPlayer from "react-player";
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
import { Video, VideoList } from "@/models/Video";
import { Rating, Chip } from "@mui/material";
import Footter from "@/components/movie/Footer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Styles } from "@/stylescomponents/style";
import ArrowBackIosNewTwoToneIcon from "@mui/icons-material/ArrowBackIosNewTwoTone";
import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

const MovieDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);
  const { data, error } = useSWR<Movie>(
    `/movie/${id}?append_to_response=credits`,
    fetcher
  );
  const { data: dataVideo } = useSWR(`/movie/${id}/videos`);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === dataVideo?.results.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? dataVideo?.results.length - 1 : prevIndex - 1
    );
  };

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
            Cast:
            <Grid container spacing={2}>
              {data.credits?.cast?.slice(0, 5).map((actor) => (
                <Grid item key={actor.id} xs={12} sm={6} md={4} lg={3}>
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
                        sx={{ marginRight: "10px" }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {actor.name}
                        </Typography>
                        <Typography variant="body2">{`${actor.character}`}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Typography>
        </Box>
      </Stack>
      <Stack>
        {dataVideo?.results && dataVideo.results.length > 0 && (
          <Stack alignItems="center" spacing={1}>
            <ReactPlayer
              key={dataVideo.results[currentVideoIndex].id}
              url={`https://www.youtube.com/watch?v=${dataVideo.results[currentVideoIndex].key}`}
              width="100%"
              height="200px"
              controls={true}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <ArrowBackIosNewTwoToneIcon
                sx={Styles._button}
                onClick={handlePrevVideo}
              />
              <ArrowForwardIosTwoToneIcon
                sx={Styles._button}
                onClick={handleNextVideo}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
      <Footter />
    </>
  );
};

MovieDetail.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieDetail;
