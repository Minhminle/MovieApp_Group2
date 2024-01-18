import { Box, Button, Chip, Stack, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { MovieList } from "@/models/Movie";
import { ReactElement } from "react";
import config from "@/config";
import { Styles } from "@/stylescomponents/style";
const Find = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useSWR<MovieList>(
    searchQuery ? `/search/movie?query=${searchQuery}` : null
  );
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  // const handleSearch = () => {
  //   // Trigger a re-fetch when the search button is clicked
  //   if (searchQuery) {
  //     // SWR will automatically re-fetch with the updated URL
  //   }
  // };

  return (
    <>
      <Stack direction="column" spacing={2}>
        <Box>
          <TextField
            fullWidth
            id="fullWidth"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ backgroundColor: "white" }}
            color="warning"
          />
        </Box>
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
                    <Typography sx={Styles._title}>{movie.title}</Typography>
                    <Typography sx={Styles._title}>
                      {movie.release_date}
                    </Typography>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </>
  );
};

Find.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Find;
