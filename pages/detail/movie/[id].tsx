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
  Stack,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";
import { Movie } from "@/models/Movie";
import { Rating, Chip } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import DownloadIcon from "@mui/icons-material/Download";

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  // Thêm các thuộc tính khác của cast nếu cần
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

  if (error) return <div>Error loading movie details</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <Stack gap={4}>
      <Box
        component="img"
        src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
        alt={data.title}
        style={{
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
        }}
      />
      <Stack>
        <Typography variant="h3" sx={{}}>
          {data.title}
        </Typography>
        <Stack direction={"row"}>
          <Typography color={"gray"}>{data.release_date}</Typography>
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
        <Stack direction={"row"} spacing={1}>
          <Button
            sx={{
              backgroundColor: "green",
              fontSize: "10px",
            }}
            variant="contained"
            startIcon={<PlayCircleFilledIcon />}
            // onClick={() => handleDetailClick(movie.id)}
          >
            Continue Watching
          </Button>
          <Button
            color="inherit"
            sx={{ fontSize: "10px" }}
            variant="outlined"
            startIcon={<TurnedInNotIcon />}
          />
          <Button
            color="inherit"
            sx={{ fontSize: "10px" }}
            variant="outlined"
            startIcon={<ThumbUpOffAltIcon />}
          />
          <Button
            color="inherit"
            sx={{ fontSize: "10px" }}
            variant="outlined"
            startIcon={<DownloadIcon />}
          />
        </Stack>
      </Stack>
      <Typography
        variant="body1"
        sx={{ fontSize: "18px", color: "#555", marginBottom: "20px" }}
      >
        {data.overview}
      </Typography>
    </Stack>
  );
};

MovieDetail.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieDetail;
