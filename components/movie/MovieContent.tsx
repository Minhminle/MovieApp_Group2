import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { MovieList } from "@/models/Movie";

type Props = {};

// Create a reusable Read More/Less component
const ExpandableText = ({ children, descriptionLength }) => {
  const fullText = children;
  // Set the initial state of the text to be collapsed
  const [isExpanded, setIsExpanded] = useState(false);
  // This function is called when the read more/less button is clicked
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

const MovieContent = (props: Props) => {
  const router = useRouter();

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);

  const { data, isLoading, error } = useSWR<MovieList>(
    "/movie/popular",
    fetcher
  );

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  console.log(data);
  return (
    <>
      <Stack
        gap={4}
        direction="row"
        sx={{ overflowX: "auto", padding: "10px" }}
      >
        {data?.results.map((movie) => (
          <Stack key={movie.id}>
            <Box
              fontSize={"50px"}
              sx={{ width: "375px" }}
              onClick={() => handleDetailClick(movie.id)}
            >
              {movie.title}
            </Box>
            <Stack direction={"row"} spacing={2}>
              <StarIcon sx={{ color: "yellow" }} className="star-icon" />
              <Box>{movie.vote_average}</Box>
              <Box>{movie.release_date}</Box>
              <Box>
                <Typography>genre</Typography>
              </Box>
            </Stack>
            <Box>
              {/* Only show 100 characters in the beginning */}
              <ExpandableText descriptionLength={100}>
                {movie.overview}
              </ExpandableText>
            </Box>
            <Stack direction={"row"} spacing={3}>
              <Button
                onClick={() => handleDetailClick(movie.id)}
                sx={{ backgroundColor: "green", width: "50%" }}
                variant="contained"
                startIcon={<AddCircleIcon />}
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
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default MovieContent;
