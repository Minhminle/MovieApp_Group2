// pages/detail/[id].tsx
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ReactElement, useState } from "react";
import { Movie } from "@/models/Movie";
import { Rating, Chip } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import { format } from "date-fns";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  // Thêm các thuộc tính khác của cast nếu cần
}

const DetailHeader = () => {
  const router = useRouter();
  const { id } = router.query;
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };
  const [isThumbUpPressed, setIsThumbUpPressed] = useState(false);

  const handleThumbUp = () => {
    setIsThumbUpPressed((prev) => !prev);
  };
  const [isTurnedInPressed, setIsTurnedInPressed] = useState(false);

  const handleTurnedIn = () => {
    setIsTurnedInPressed((prev) => !prev);
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

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);
  const { data, error } = useSWR<Movie>(
    `/movie/${id}?append_to_response=credits`,
    fetcher
  );

  if (error) return <div>Error loading movie details</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <>
      <Stack
        direction="row"
        spacing={32}
        sx={{ position: "absolute", zIndex: "1", left: "20px", top: "20px" }}
      >
        <ArrowBackIcon
          onClick={() => router.back()}
          sx={{ fontSize: "40px" }}
        />
        <Chip
          icon={<FavoriteIcon />}
          label={`${data.vote_count}`}
          sx={{
            top: "15px",
            right: "15px",

            backgroundColor: "yellow",
            color: "black",
          }}
        />
      </Stack>
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={
            data.poster_path
              ? `https://image.tmdb.org/t/p/w400${data.poster_path}`
              : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
          }
          alt={data.title}
          sx={{
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
            width: "400px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            zIndex: "1",
            bottom: "0px",
            right: "-11px",
          }}
        >
          <Stack
            spacing={1}
            sx={{
              background: "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
              width: "350px",
              bottom: "0px",
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
                <FavoriteIcon
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
      </Box>

      <Stack>
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
    </>
  );
};

DetailHeader.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default DetailHeader;