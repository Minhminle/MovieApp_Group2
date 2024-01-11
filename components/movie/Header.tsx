import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import { MovieList } from "@/models/Movie"; // Import Movie instead of MovieList

type Props = {};

const Header = (props: Props) => {
  const router = useRouter();
  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);
  const { data, isLoading, error } = useSWR<MovieList>(
    "/movie/upcoming",
    fetcher
  );

  return (
    <>
      <Stack gap={4} direction={"row"}>
        <Box>
          {data?.results.map((movie) => (
            <Stack key={movie.id} spacing={2}>
              <Stack>
                <Box
                  component="img"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  width={"100%"}
                />
              </Stack>
              <Box
                sx={{
                  background:
                    "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7))",
                }}
              >
                <Box fontSize={"30px"}>{movie.title}</Box>
                <Stack direction={"row"} spacing={2}>
                  <Box>{movie.release_date}</Box>
                  <Box>
                    <Typography>genre</Typography>
                  </Box>
                </Stack>
                <Box>{movie.overview}</Box>
                <Stack direction={"row"} spacing={3}>
                  <Button
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
              </Box>
            </Stack>
          ))}
        </Box>
      </Stack>
    </>
  );
};

export default Header;
