import { MovieList } from "@/models/Movie";
import { Box, Button, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarIcon from "@mui/icons-material/Star";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import React, { useState } from "react";

const MovieFeature = () => {
  const router = useRouter();

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);
  const { data, isLoading, error } = useSWR<MovieList>(
    "/movie/upcoming",
    fetcher
  );

  console.log(data);

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);

  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };
  return (
    <>
      <Box color="white" fontSize={"30px"} padding={4}>
        {" "}
        FeaTured in SaintStream
      </Box>
      <Stack sx={{ overflowX: "auto" }} direction="column">
        <Box>
          <Stack
            gap={4}
            direction="row"
            alignItems="center"
            // Thêm kiểm soát tràn ngang
          >
            {data?.results.map((movie) => (
              <Stack
                key={movie.id}
                direction="column"
                alignItems="center"
                position={"relative"}
              >
                <Box
                  component="img"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  width={300}
                  height={500}
                  sx={{ borderRadius: "10%" }}
                  onClick={() => handleDetailClick(movie.id)}
                />

                <Box
                  position={"absolute"}
                  zIndex={"1"}
                  bottom={"20px"}
                  left={"30px"}
                >
                  <Box
                    sx={{
                      flexGrow: 1,
                      color: "white",
                      marginTop: "20px",
                      marginLeft: "5px",
                      fontSize: "20px",
                    }}
                  >
                    {movie.title}
                  </Box>
                  <Stack direction="row" alignItems="center">
                    <StarRateIcon sx={{ color: "yellow" }}></StarRateIcon>
                    <Box sx={{ color: "white" }}>
                      {(movie.vote_average * 0.5).toFixed(1)}/5
                    </Box>
                  </Stack>
                </Box>
                <Box
                  position={"absolute"}
                  zIndex={"0"}
                  top={"400px"}
                  sx={{
                    background:
                      "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                    width: "350px",
                    height: "100px",
                  }}
                ></Box>
              </Stack>
            ))}
          </Stack>
        </Box>
        <Box>
          <Stack gap={4} direction="row" sx={{ padding: "19px" }}>
            {data?.results.map((movie) => (
              <Stack key={movie.id}>
                <Box>
                  <Box
                    fontSize={"40px"}
                    sx={{ width: "300px" }}
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    {movie.title}
                  </Box>
                  <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <StarIcon sx={{ color: "yellow" }} className="star-icon" />
                    <Box
                      sx={{
                        borderRight: "solid",
                        color: "gray",
                        width: "45px",
                        height: "15px",
                      }}
                    >
                      {(movie.vote_average * 0.5).toFixed(1)}
                    </Box>
                    <Box sx={{ color: "gray" }}>{movie.release_date}</Box>
                    {/* <Box>
                  <Typography>genre</Typography>
                </Box> */}
                  </Stack>
                  <Box>
                    <Typography>
                      {expandedOverview === movie.overview
                        ? movie.overview
                        : movie.overview.length > 100
                        ? `${movie.overview.slice(0, 100)}...`
                        : movie.overview}
                    </Typography>
                    {movie.overview.length > 100 && (
                      <Button
                        sx={{ fontSize: "12px", color: "green" }}
                        onClick={() => toggleText(movie.overview)}
                      >
                        {expandedOverview === movie.overview
                          ? "Read less"
                          : "Read more"}
                      </Button>
                    )}
                  </Box>
                  <Stack direction={"row"} spacing={3}>
                    <Button
                      onClick={() => handleDetailClick(movie.id)}
                      sx={{
                        backgroundColor: "green",
                        width: "45%",
                        fontSize: "12px",
                      }}
                      variant="contained"
                      startIcon={<PlayCircleFilledIcon />}
                    >
                      Play Now
                    </Button>
                    <Button
                      color="inherit"
                      sx={{ width: "45%", fontSize: "12px" }}
                      variant="outlined"
                      startIcon={<TurnedInNotIcon />}
                    >
                      Add watchlist
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

export default MovieFeature;
