import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { MovieList } from "@/models/Movie";
import { GenreList } from "@/models/Movie";
import { ReactElement } from "react";
import config from "@/config";
import { Styles } from "@/stylescomponents/style";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MovieIcon from "@mui/icons-material/Movie";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
const Find = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data } = useSWR<MovieList>(
    searchQuery ? `/search/movie?query=${searchQuery}` : null
  );
  const { data: dataGenre } = useSWR<GenreList>("/genre/movie/list");
  // Set State cho trang hiện tại và tất cả phim
  const [currentPage, setCurrentPage] = useState(1);
  const [allMovies, setAllMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [moviesByGenre, setMoviesByGenre] = useState([]);
  const [showGenres, setShowGenres] = useState(true);
  const [currentGenrePage, setCurrentGenrePage] = useState(1);
  const [btloadMoreGenres, setbtloadMoreGenres] = useState(null);
  const [showTopRated, setShowTopRated] = useState(true);
  const [showCancelIcon, setShowCancelIcon] = useState(false);
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
  const handleCancelClick = () => {
    setShowTopRated(true);
    setMoviesByGenre([]);
    setSelectedGenre(null);
    setShowCancelIcon(false);
    setbtloadMoreGenres(null);
  };
  const handleGenreClick = (genreId: number) => {
    axios
      .get(`/discover/movie?with_genres=${genreId}&page=1`)
      .then((response) => {
        const movies = response.data.results;
        setMoviesByGenre(movies);
        setSelectedGenre(genreId);
        setShowTopRated(false);
        setShowCancelIcon(true);
        setbtloadMoreGenres(genreId);
        setCurrentGenrePage(2);
      });
  };

  // Lấy tất cả các trang của toprated
  const fetchTotalPages = async () => {
    const response = await axios.get("/movie/top_rated");
    return response.data.total_pages;
  };
  const { data: totalPages } = useSWR("/movie/top_rated", fetchTotalPages);

  //
  const fetchAllMovies = async () => {
    if (!currentPage) return;
    const response = await axios.get(`/movie/top_rated?page=${currentPage}`);
    const movies = response.data.results.slice(0, 20);
    setAllMovies((prevMovies) => [...prevMovies, ...movies]);
    setCurrentPage(currentPage + 1);
  };

  const { data: allMoviesData } = useSWR(
    totalPages ? `/movie/top_rated?page=1` : null,
    fetchAllMovies
  );
  const handleLoadMore = () => {
    if (showTopRated) {
      fetchAllMovies();
    }
  };
  const handleLoadMoreGenres = () => {
    if (showTopRated) {
      fetchAllMovies();
    } else {
      axios
        .get(
          `/discover/movie?with_genres=${selectedGenre}&page=${currentGenrePage}`
        )
        .then((response) => {
          const newMovies = response.data.results;
          setMoviesByGenre((prevMovies) => [...prevMovies, ...newMovies]);
          setCurrentGenrePage((prevPage) => prevPage + 1);
        });
    }
  };

  useEffect(() => {
    const { genre } = router.query;
    if (genre) {
      // Cập nhật
      setSelectedGenre(parseInt(genre));
      handleGenreClick(genre);
    }
  }, [router.query]);

  return (
    <>
      <Stack sx={{ pt: "10px" }}>
        <Stack direction="column" spacing={2}>
          {/* Đổ data của thẻe loại film được chọn  */}
          <Stack direction="row" spacing={2} alignItems="center">
            <ArrowBackIcon
              onClick={() => router.back()}
              sx={{ fontSize: "40px" }}
            />
            <Box>
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
                  "& .MuiInputBase-input": {
                    color: searchQuery ? "white" : "grey",
                  },
                  "& .MuiSvgIcon-root": {
                    color: searchQuery ? "transparent" : "grey",
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
          {showGenres && (
            <Box sx={{ pl: "45px" }}>
              <Stack spacing={1} sx={{ width: "95%" }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    style={{ cursor: "pointer" }}
                  >
                    <Typography
                      sx={{ ...Styles._title, color: "grey" }}
                      variant="h5"
                    >
                      Genres
                    </Typography>
                  </Stack>
                  {showCancelIcon && (
                    <CancelIcon
                      onClick={handleCancelClick}
                      sx={{ color: "white" }}
                    />
                  )}
                </Stack>

                <Box sx={{ ml: "10px" }}>
                  <Grid container>
                    {dataGenre?.genres.map((genre) => (
                      <Grid item xs={4} key={genre.id}>
                        <Stack
                          direction="row"
                          justifyContent="flex-start"
                          onClick={() => handleGenreClick(genre.id)}
                        >
                          <Typography
                            sx={{
                              color:
                                selectedGenre == genre.id ? "yellow" : "white",
                              cursor: "pointer",
                            }}
                          >
                            {genre.name}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

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
                    {btloadMoreGenres && (
                      <Box sx={{ textAlign: "center" }}>
                        <Button
                          onClick={handleLoadMoreGenres}
                          variant="contained"
                        >
                          LOAD MORE
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>
          )}

          {/* showmovieToprated */}

          <Box sx={{ pl: "45px" }}>
            <Box sx={{ width: "90%" }}>
              {!searchQuery && (showTopRated ? allMovies : null) && (
                <Stack direction="column" spacing={2}>
                  {allMovies?.map((movie) => (
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
                  <Box sx={{ textAlign: "center" }}>
                    <Button onClick={handleLoadMore} variant="contained">
                      LOAD MORE
                    </Button>
                  </Box>
                </Stack>
              )}
            </Box>
          </Box>

          {/* result films */}
          <Box sx={{ pl: "45px" }}>
            <Box sx={{ width: "90%" }}>
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
