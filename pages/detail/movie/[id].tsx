import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import ReactPlayer from "react-player";
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
import { Video, VideoList } from "@/models/Video";
import { Rating, Chip } from "@mui/material";
import Footter from "@/components/movie/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Styles } from "@/stylescomponents/style";
import ArrowBackIosNewTwoToneIcon from "@mui/icons-material/ArrowBackIosNewTwoTone";
import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import { format } from "date-fns";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
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
  if (error) return <div>Error loading movie details</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Stack>
        <Box
          component="img"
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
          alt={data.title}
          sx={{
            position: "relative",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
          }}
        />
        <Chip
          icon={<ThumbUpIcon />}
          label={`${data.vote_count}`}
          sx={{
            position: "absolute",
            top: "15px",
            right: "15px",
            zIndex: 1,
            backgroundColor: "yellow",
            color: "black",
          }}
        />

        <Box>
          <Stack
            spacing={1}
            sx={{
              background: "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
              position: "absolute",
              bottom: "90px",
              zIndex: 1,
              padding: "20px",
            }}
          >
            <Typography variant="h3" sx={{}}>
              {data.title}
            </Typography>
            <Stack direction={"row"}>
              <Typography sx={{ color: "yellow" }}>
                <StarIcon></StarIcon>
              </Typography>
              <Typography sx={{ color: "yellow" }}>
                {(data.vote_average * 0.5).toFixed(1)}
              </Typography>
              <Typography color={"gray"}>
                -{formatRuntime(data.runtime)}-
              </Typography>
              <Typography color={"gray"}>
                {format(new Date(data.release_date), "yyyy")}
              </Typography>
              <Typography>
                {data.genres?.map((genre) => (
                  <Typography
                    key={genre.id}
                    sx={{
                      display: "inline-block",
                      color: "gray",
                    }}
                  >
                    -{genre.name}
                  </Typography>
                ))}
              </Typography>
            </Stack>
            <Stack direction={"row"} spacing={1} width={"100%"}>
              <Button
                sx={{
                  backgroundColor: "green",
                  fontSize: "13px",
                }}
                variant="contained"
                startIcon={<PlayCircleFilledIcon />}
                // onClick={() => handleDetailClick(movie.id)}
              >
                Continue Watching
              </Button>
              <IconButton color="inherit">
                <TurnedInIcon
                  sx={{ color: isTurnedInPressed ? "yellow" : "inherit" }}
                  onClick={handleTurnedIn}
                />
              </IconButton>
              <IconButton color="inherit">
                <ThumbUpIcon
                  sx={{ color: isThumbUpPressed ? "red" : "inherit" }}
                  onClick={handleThumbUp}
                />
              </IconButton>
              <IconButton color="inherit">
                <DownloadIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        <Box padding={"20px"}>
          <Stack>
            <Typography sx={{ fontSize: "30px" }}>Story Line</Typography>
            <Typography sx={{ fontSize: "18px", color: "#555" }}>
              {expandedOverview === data.overview
                ? data.overview
                : data.overview.length > 90
                ? `${data.overview.slice(0, 90)}...`
                : data.overview}
              {data.overview.length > 90 && (
                <Button
                  sx={{ fontSize: "12px", color: "green" }}
                  onClick={() => toggleText(data.overview)}
                >
                  {expandedOverview === data.overview ? "Less" : "More"}
                </Button>
              )}
            </Typography>
          </Stack>
        </Box>
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  sx={{
                    "& .MuiTab-root": {
                      color: "#9e9e9e", // Màu chữ khi không được chọn
                    },
                    "& .Mui-selected": {
                      color: "white", // Màu chữ khi được chọn
                    },
                  }}
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Trailers" value="1" />
                  <Tab label="Reviews" value="2" />
                  <Tab label="Discussions" value="3" />
                </TabList>
              </Box>
            </TabContext>
          </Box>
          <TabPanel value="1">
            {" "}
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
          </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      </Box>
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
      <Footter />
    </>
  );
};

MovieDetail.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieDetail;
