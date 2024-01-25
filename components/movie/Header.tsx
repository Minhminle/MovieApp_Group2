import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react"; // Import useState
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { MovieList } from "@/models/Movie";

type Props = {};
const ExpandableText = ({ children, descriptionLength }) => {
  const fullText = children;
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <p className="text">
      {isExpanded ? fullText : `${fullText.slice(0, descriptionLength)}...`}
      <span onClick={toggleText} className="toggle-button">
        {isExpanded ? "Read less" : "Read more"}
      </span>
    </p>
  );
};

const Header = (props: Props) => {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<MovieList>("/movie/popular");
  const { data: dataGenre } = useSWR("/genre/movie/list");

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };

  console.log(data);
  const genres = dataGenre?.genres || [];
  return (
    <>
      <Box>
        <Stack gap={4} direction="row" sx={{ overflowX: "auto" }}>
          {data?.results.slice(0, 2).map((movie) => (
            <Stack key={movie.id} spacing={2}>
              <Stack>
                <Box
                  component="img"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  width={"375px"}
                  onClick={() => handleDetailClick(movie.id)}
                />
              </Stack>
              <Box
                sx={{
                  padding: "10px",
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7))",
                }}
              >
                <Box
                  sx={_letterStyles}
                  fontSize={"50px"}
                  onClick={() => handleDetailClick(movie.id)}
                >
                  {movie.title}
                </Box>
                <Stack direction={"row"} spacing={2}>
                  <Box sx={{ paddingTop: "2px" }}>{movie.release_date}</Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9e9e9e",
                      fontSize: "15px",
                    }}
                  >
                    |{" "}
                    {movie.genre_ids && movie.genre_ids.length > 0
                      ? movie.genre_ids
                          .slice(0, 2)
                          .map((genreId) => {
                            const foundGenre = genres.find(
                              (genre) => genre.id === genreId
                            );
                            return foundGenre
                              ? foundGenre.name
                              : "Unknown Genre";
                          })
                          .join(" - ")
                      : "Unknown Genre"}
                  </Typography>
                </Stack>
                <Box>
                  <ExpandableText descriptionLength={100}>
                    {movie.overview}
                  </ExpandableText>
                </Box>
                <Stack direction={"row"} spacing={3}>
                  <Button
                    sx={{ backgroundColor: "green", width: "50%" }}
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    Play Now
                  </Button>
                  <Button
                    color="inherit"
                    sx={{ width: "50%" }}
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
    </>
  );
};

export default Header;
