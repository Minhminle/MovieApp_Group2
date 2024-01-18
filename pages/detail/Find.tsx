import { Box, Button, Chip, Stack, Typography, TextField } from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { MovieList } from "@/models/Movie";
import { ReactElement } from "react";

const Find = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useSWR<MovieList>(
    searchQuery ? `/search/movie?query=${searchQuery}` : null
  );

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const handleSearch = () => {
    // Trigger a re-fetch when the search button is clicked
    if (searchQuery) {
      // SWR will automatically re-fetch with the updated URL
    }
  };

  return (
    <>
      <Box>
        <TextField
          fullWidth
          id="fullWidth"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ backgroundColor: "white" }}
        />
      </Box>

      {isLoading && <Typography>Loading...</Typography>}
      {error && <Typography>Error loading data</Typography>}

      {data && (
        <Stack spacing={2}>
          {data.results.map((movie) => (
            <Chip
              key={movie.id}
              label={movie.title}
              onClick={() => handleDetailClick(movie.id)}
              sx={{ backgroundColor: "white" }}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

Find.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default Find;
