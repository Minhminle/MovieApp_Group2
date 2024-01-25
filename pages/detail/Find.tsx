import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { MovieList } from "@/models/Movie";
import { GenreList } from "@/models/Movie";
import { ReactElement } from "react";
import config from "@/config";
import { Styles } from "@/stylescomponents/style";
import { SelectChangeEvent } from "@mui/material/Select";

const Find = () => {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState(""); // State để lưu trữ genre được chọn
  const { data, isLoading, error } = useSWR<MovieList>(
    selectedGenre ? `/discover/movie?with_genres=${selectedGenre}` : null
  );

  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  // Function để xử lý thay đổi của dropdown để chọn genre
  const handleGenreChange = (event: SelectChangeEvent<string>) => {
    setSelectedGenre(event.target.value);
  };

  return (
    <>
      <Stack direction="column" spacing={2}>
        <Box>
          {/* Thêm dropdown để chọn genre */}
          <Select
            value={selectedGenre}
            onChange={handleGenreChange}
            sx={{ backgroundColor: "white" }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Genre
            </MenuItem>
            <MenuItem value="28">Action</MenuItem>
            <MenuItem value="35">Comedy</MenuItem>
            {/* Thêm các MenuItem khác cho các genre khác */}
          </Select>
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
