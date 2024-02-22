import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import React, { useState } from "react"; // Import useState
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { MovieList, Movie } from "@/models/Movie";
import { format } from "date-fns";

type Props = {};

const Header = (props: Props) => {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<MovieList>("/movie/popular");
  // const { data: dataGenre } = useSWR("/genre/movie/list");
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

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);

  // const toggleText = (overview: string) => {
  //   setExpandedOverview((prev) => (prev === overview ? null : overview));
  // };

  console.log(data);
  if (!data)
    return (
      <div>
        <LinearProgress color="inherit" />
      </div>
    );
  return (
    <>
      <Box>
        <Stack gap={4} direction="row" sx={{ overflowX: "auto" }}>
          {data?.results.slice(0, 2).map((movie) => (
            <Stack key={movie.id} spacing={2} sx={{ position: "relative" }}>
              <Stack>
                <Box
                  component="img"
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
                  }
                  width={"auto"}
                  height={"560px"}
                  onClick={() => handleDetailClick(movie.id)}
                />
              </Stack>
              <Box
                padding={"20px"}
                sx={{
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                  position: "absolute",
                  bottom: 0,
                  zIndex: 1,
                }}
              >
                <Stack spacing={1}>
                  <Box
                    sx={_letterStyles}
                    fontSize={"40px"}
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    {expandedOverview === movie.title
                      ? movie.title
                      : movie.title.length > 15
                      ? `${movie.title.slice(0, 15)}...`
                      : movie.title}
                  </Box>
                  <Stack direction={"row"} spacing={1}>
                    <Box sx={{ paddingTop: "2px" }}>
                      {format(new Date(movie.release_date), "dd/MM/yyyy")}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
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
                        : movie.overview.length > 90
                        ? `${movie.overview.slice(0, 90)}...`
                        : movie.overview}
                    </Typography>
                  </Box>

                  <Button
                    sx={{ backgroundColor: "green", width: "100%" }}
                    variant="contained"
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    Read more
                  </Button>
                </Stack>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </>
  );
};

export default Header;
