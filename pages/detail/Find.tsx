import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { MovieList } from "@/models/Movie";
import { GenreList } from "@/models/Movie";
import { ReactElement } from "react";
import config from "@/config";
import { Styles } from "@/stylescomponents/style";
import ArrowBackIosNewTwoToneIcon from "@mui/icons-material/ArrowBackIosNewTwoTone";
import MovieIcon from "@mui/icons-material/Movie";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
const Find = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useSWR<MovieList>(
    searchQuery ? `/search/movie?query=${searchQuery}` : null
  );
  const { data: dataGenre } = useSWR<GenreList>("/genre/movie/list");
  const { data: datatoprated } = useSWR<MovieList>("/movie/top_rated");
  const [moviesByGenre, setMoviesByGenre] = useState([]);
  const [showGenres, setShowGenres] = useState(false);

  const handleSearchChange = (event) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);

    if (newSearchQuery.trim() === "") {
      setShowGenres(true);
    } else {
      setShowGenres(false);
    }
  };

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const handleGenresClick = () => {
    setShowGenres(!showGenres);
  };

  const handleGenreClick = (genreId) => {
    axios
      .get(`/discover/movie?api_key=${config.api_key}&with_genres=${genreId}`)
      .then((response) => {
        console.log(response);
        const movies = response.data.results;
        setMoviesByGenre(movies);
      });
  };

  return (
    <>
      <Stack sx={{ pt: "10px" }}>
        <Stack direction="column" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <ArrowBackIosNewTwoToneIcon
              onClick={() => {
                router.push("/");
              }}
              sx={{ color: "#454545" }}
            />
            <Box component="textPath">
              <TextField
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  backgroundColor: "#454545",
                  borderRadius: 20,
                  paddingRight: "60px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <>
                      <SearchIcon sx={{ color: "grey", marginLeft: "10px" }} />
                    </>
                  ),
                }}
              />
            </Box>
          </Stack>
          {/* fitlerresultgenresfilm */}
          <Stack spacing={1}>
            <Stack
              direction="row"
              alignItems="center"
              onClick={handleGenresClick}
              style={{ cursor: "pointer" }}
            >
              <Typography sx={Styles._title} variant="h5">
                Genres
              </Typography>
              <ExpandMoreIcon sx={Styles._button} />
            </Stack>
            {showGenres && (
              <>
                <Grid container>
                  {dataGenre?.genres.map((genre) => (
                    <Grid item xs={4} key={genre.id}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-evenly"
                        onClick={() => handleGenreClick(genre.id)}
                      >
                        <Typography sx={Styles._title}>{genre.name}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Box>
                  <Stack direction="column" spacing={2}>
                    {moviesByGenre.map((movie) => (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={4}
                        key={movie.id}
                        onClick={() => handleDetailClick(movie.id)}
                      >
                        <Box
                          component="img"
                          src={
                            movie.poster_path
                              ? config.image_path + movie.poster_path
                              : "/images/replace_img.jpg"
                          }
                          width={100}
                          height={150}
                        />
                        <Stack>
                          <Stack direction="row" spacing={1}>
                            <MovieIcon sx={Styles._iconresultfind} />
                            <Typography sx={Styles._title}>
                              {movie.title}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={1}>
                            <CalendarTodayIcon sx={Styles._iconresultfind} />
                            <Typography sx={Styles._title}>
                              {movie.release_date}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={1}>
                            <Box
                              component="img"
                              src="https://img.icons8.com/arcade/24/star.png"
                              alt="star"
                            />
                            <Typography sx={Styles._title}>
                              {movie.vote_average}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </>
            )}
          </Stack>
          {/* showmovieToprated */}
          <Box>
            {!searchQuery && datatoprated?.results && (
              <Stack direction="column" spacing={2}>
                {datatoprated.results.map((movie) => (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={4}
                    key={movie.id}
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    <Box
                      component="img"
                      src={
                        movie.poster_path
                          ? config.image_path + movie.poster_path
                          : "/images/replace_img.jpg"
                      }
                      width={100}
                      height={150}
                    />
                    <Stack>
                      <Stack direction="row" spacing={1}>
                        <MovieIcon sx={Styles._iconresultfind} />
                        <Typography sx={Styles._title}>
                          {movie.title}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <CalendarTodayIcon sx={Styles._iconresultfind} />
                        <Typography sx={Styles._title}>
                          {movie.release_date}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Box
                          component="img"
                          src="https://img.icons8.com/arcade/24/star.png"
                          alt="star"
                        />
                        <Typography sx={Styles._title}>
                          {movie.vote_average}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>

          {/* result films */}
          <Box>
            {data && (
              <Stack direction="column" spacing={2}>
                {data.results.map((movie) => (
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={4}
                    key={movie.id}
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    <Box
                      component="img"
                      src={
                        movie.poster_path
                          ? config.image_path + movie.poster_path
                          : "/images/replace_img.jpg"
                      }
                      width={100}
                      height={150}
                    />
                    <Stack>
                      <Stack direction="row" spacing={1}>
                        <MovieIcon sx={Styles._iconresultfind} />
                        <Typography sx={Styles._title}>
                          {movie.title}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <CalendarTodayIcon sx={Styles._iconresultfind} />
                        <Typography sx={Styles._title}>
                          {movie.release_date}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Box
                          component="img"
                          src="https://img.icons8.com/arcade/24/star.png"
                          alt="star"
                        />
                        <Typography sx={Styles._title}>
                          {movie.vote_average}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Stack>
    </>
  );
};

Find.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Find;
