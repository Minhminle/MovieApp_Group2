import { MovieList } from "@/models/Movie";
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import StarRateIcon from "@mui/icons-material/StarRate";
import StarIcon from "@mui/icons-material/Star";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import React, { useState } from "react";
import { format } from "date-fns";

const MovieFeature = () => {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<MovieList>("/movie/top_rated");
  const { data: movieGenres } = useSWR("/genre/movie/list");
  // const genresList: GenreList[] = movieGenres?.genres
  //   ? movieGenres.genres.map((genre: Genre) => [genre])
  //   : [];

  const getGenreNameById = (genreId: number) => {
    // Kiểm tra xem movieGenres có tồn tại và có thuộc tính genres không
    if (movieGenres && movieGenres.genres) {
      const genre = movieGenres.genres.find(
        (g: { id: number }) => g.id === genreId
      );
      return genre ? genre.name : "Unknown Genre";
    }
    // Trả về giá trị mặc định nếu movieGenres không tồn tại hoặc không có thuộc tính genres
    return "Unknown Genre";
  };

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
  if (!data)
    return (
      <div>
        <LinearProgress color="inherit" />
      </div>
    );
  return (
    <>
      <Stack sx={{ overflowX: "auto" }} direction="column">
        <Typography
          color="white"
          variant="h4"
          sx={{ ..._letterStyles, padding: "10px" }}
        >
          FeaTured SaintStream
        </Typography>
        <Box>
          <Stack
            gap={4}
            direction="row"
            alignItems="center"
            marginLeft={"15px"}
            // Thêm kiểm soát tràn ngang
          >
            {data?.results?.map((movie) => (
              <Stack
                key={movie.id}
                direction="column"
                alignItems="center"
                position={"relative"}
              >
                <Box
                  component="img"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
                  }
                  width={300}
                  height={500}
                  sx={{ borderRadius: "60px" }}
                  onClick={() => handleDetailClick(movie.id)}
                />
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
          <Stack
            gap={4}
            direction="row"
            sx={{ padding: "15px", marginTop: "-15px" }}
          >
            {data?.results?.map((movie) => (
              <Stack key={movie.id}>
                <Box>
                  <Box
                    fontSize={"40px"}
                    sx={{ width: "300px" }}
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    {expandedOverview === movie.title
                      ? movie.title
                      : movie.title.length > 10
                      ? `${movie.title.slice(0, 10)}...`
                      : movie.title}
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
                    <Box sx={{ paddingTop: "2px" }}>
                      {format(new Date(movie.release_date), "dd/MM/yyyy")}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#9e9e9e",
                        fontSize: "15px",
                      }}
                    >
                      |{" "}
                      {movie.genre_ids
                        ?.slice(0, 2)
                        .map((genreId, index, array) => (
                          <React.Fragment key={genreId}>
                            {getGenreNameById(genreId)}
                            {index < array.length - 1 && " - "}{" "}
                            {/* Hiển thị dấu phân tách nếu không phải là phần tử cuối cùng */}
                          </React.Fragment>
                        ))}
                    </Typography>
                  </Stack>
                  <Box>
                    <Typography>
                      {expandedOverview === movie.overview
                        ? movie.overview
                        : movie.overview.length > 80
                        ? `${movie.overview.slice(0, 80)}...`
                        : movie.overview}
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => handleDetailClick(movie.id)}
                    sx={{
                      backgroundColor: "green",
                      width: "90%",
                      fontSize: "12px",
                      marginTop: "3px",
                    }}
                    variant="contained"
                  >
                    Read more
                  </Button>
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
