import { useState, useEffect } from "react";
import useSWR from "swr";
import ArrowBackIosNewTwoToneIcon from "@mui/icons-material/ArrowBackIosNewTwoTone";
import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";
import { Movie, MovieList } from "@/models/Movie";
import { useRouter } from "next/router";
import { Box, Container, Stack, Typography } from "@mui/material";
import config from "@/config";
import { Styles } from "@/stylescomponents/style";
import axios from "axios";
type Props = {
  movie: Movie;
};

const MovieItem = () => {
  const router = useRouter();
  const { id } = router.query;
  const [upcomingIdx, setUpcomingIdx] = useState(0);
  const [topRatedIdx, setTopRatedIdx] = useState(0);
  const { data: upcomingData } = useSWR<MovieList>(`/movie/upcoming`);
  const { data: topRatedData } = useSWR<MovieList>("/movie/top_rated");
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const Moviecard = ({ movie }: Props) => {
    return (
      <Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ pt: "20px" }}
        >
          <Box
            onClick={() => handleDetailClick(movie.id)}
            component="img"
            src={config.image_path + movie.poster_path}
            alt=""
            width={80}
            height={120}
            sx={{ borderRadius: "10px" }}
          />
          <Stack>
            <Typography sx={Styles._title}>{movie.title}</Typography>
            <Stack>
              {movie.genres?.map((genre) => (
                <Typography sx={Styles._typefilm} key={genre.id}>
                  {genre.name}
                </Typography>
              ))}
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                component="img"
                src="https://img.icons8.com/arcade/24/star.png"
                alt="star"
              />
              <Typography variant="body2" sx={Styles._content}>
                {movie.vote_average}|Movie
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  const ShowMovies = ({
    movies,
    startIndex,
  }: {
    movies: Movie[];
    startIndex: number;
  }) => {
    return (
      <Stack>
        {movies.slice(startIndex, startIndex + 4).map((movie) => (
          <Box key={movie.id}>
            <Moviecard movie={movie} />
          </Box>
        ))}
      </Stack>
    );
  };

  const navigateMovies = (
    type: "upcoming" | "topRated",
    direction: "prev" | "next"
  ) => {
    const indexState =
      type === "upcoming"
        ? [upcomingIdx, setUpcomingIdx]
        : [topRatedIdx, setTopRatedIdx];
    const dataList =
      type === "upcoming" ? upcomingData?.results : topRatedData?.results;

    if (dataList) {
      const newIndex =
        direction === "next" ? indexState[0] + 4 : indexState[0] - 4;
      indexState[1](Math.max(0, Math.min(newIndex, dataList.length - 4)));
    }
  };
  // useEffect(() => {
  // }, []);

  return (
    <Container>
      <Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={Styles._title} variant="h4">
            Upcoming
          </Typography>
          <Stack direction="row" spacing={1}>
            <ArrowBackIosNewTwoToneIcon
              sx={Styles._button}
              onClick={() => navigateMovies("upcoming", "prev")}
            />
            <ArrowForwardIosTwoToneIcon
              sx={Styles._button}
              onClick={() => navigateMovies("upcoming", "next")}
            />
          </Stack>
        </Stack>
        <ShowMovies
          movies={upcomingData?.results || []}
          startIndex={upcomingIdx}
        />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={Styles._title} variant="h4">
            Top Rated
          </Typography>
          <Stack direction="row" spacing={1}>
            <ArrowBackIosNewTwoToneIcon
              sx={Styles._button}
              onClick={() => navigateMovies("topRated", "prev")}
            />
            <ArrowForwardIosTwoToneIcon
              sx={Styles._button}
              onClick={() => navigateMovies("topRated", "next")}
            />
          </Stack>
        </Stack>
        <ShowMovies
          movies={topRatedData?.results || []}
          startIndex={topRatedIdx}
        />
      </Box>
    </Container>
  );
};

export default MovieItem;
