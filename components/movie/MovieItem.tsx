import { useState, type ReactElement } from "react";
import useSWR from "swr";
import ArrowBackIosNewTwoToneIcon from "@mui/icons-material/ArrowBackIosNewTwoTone";
import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Movie, MovieList } from "@/models/Movie";
import {
  Box,
  CardMedia,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import config from "@/config";
import { yellow } from "@mui/material/colors";
type Props = {
  movie: Movie;
};
const MovieItem = () => {
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const Moviecard = ({ movie }: Props) => {
    return (
      <>
        <Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ pt: "20px" }}
          >
            <Box
              component="img"
              src={config.image_path + movie.poster_path}
              alt=""
              width={80}
              height={120}
              sx={{ borderRadius: "10px" }}
            />
            <Stack>
              <Typography
                sx={{ ..._letterStyles, fontSize: "10px", fontWeight: "500" }}
              >
                {movie.title}
              </Typography>
              <Typography sx={{ fontSize: "5px", color: "gray" }}>
                {movie.release_date}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <StarRateIcon sx={{ color: "yellow" }} />
                <Typography
                  sx={{ ..._letterStyles, fontSize: "5px", fontWeight: "500" }}
                >
                  {movie.vote_average}|Movie
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </>
    );
  };

  function ShowMovie() {
    return (
      <>
        <Stack>
          {data?.results.map(
            (movie, index) =>
              index < 4 && (
                <Box key={movie.id}>
                  <Moviecard movie={movie} />
                </Box>
              )
          )}
        </Stack>
      </>
    );
  }
  const { data, isLoading, error } = useSWR<MovieList>("/movie/upcoming");
  const [result, setResult] = useState<Movie[]>(
    data?.results.slice(0, 5) ?? []
  );
  return (
    <>
      <Container>
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography sx={_letterStyles} variant="body1">
              Upcoming
            </Typography>
            <Stack direction="row" spacing={1}>
              <ArrowBackIosNewTwoToneIcon
                sx={{ color: "white", width: "10px", height: "10px" }}
              />
              <ArrowForwardIosTwoToneIcon
                sx={{ color: "white", width: "10px", height: "10px" }}
              />
            </Stack>
          </Stack>
          <ShowMovie />
        </Box>
      </Container>
    </>
  );
};
export default MovieItem;
