import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
  Tab,
} from "@mui/material";
import { ReactElement } from "react";
import { Movie } from "@/models/Movie";
import { Rating, Chip } from "@mui/material";
import Footter from "@/components/movie/Footer";
import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}
const MovieDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, error } = useSWR<Movie>(
    `/movie/${id}?append_to_response=credits,similar`
  );
  const { data: similarMoviesData, error: similarMoviesError } = useSWR(
    `/movie/${id}/similar`
  );
  const { data: MoviesLists, error: listsMoviesError } = useSWR(
    `/movie/${id}/lists`
  );
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (error) return <div>Error loading movie details</div>;
  if (!data) return <div>Loading...</div>;
  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  sx={{
                    "& .MuiTab-root": {
                      color: "#9e9e9e", // Màu chữ khi không được chọn
                    },
                    "& .Mui-selected": {
                      color: "white", // Màu chữ khi được chọn
                    },
                  }}
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Trailers" value="1" />
                  <Tab label="Reviews" value="2" />
                  <Tab label="Item Three" value="3" />
                </TabList>
              </Box>
            </TabContext>
          </Box>
          <TabPanel value="1">Item One</TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      </Box>
      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Similar Movies:
      </Typography>

      <Stack
        direction="row"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {similarMoviesData?.results.map((movie) => (
          <Box
            key={movie.id}
            sx={{
              margin: "10px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <CardMedia
              style={{
                borderRadius: "20px",
                height: "180px",
                width: "300px",
              }}
              onClick={() => handleDetailClick(movie.id)}
              component="img"
              alt={movie.title}
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
            <CardContent>
              <Typography
                variant="h5"
                onClick={() => handleDetailClick(movie.id)}
              >
                {expandedOverview === movie.title
                  ? movie.title
                  : movie.title.length > 15
                  ? `${movie.title.slice(0, 15)}...`
                  : movie.title}
              </Typography>
              <Stack direction={"row"} spacing={2}>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <StarIcon style={{ marginRight: "4px", color: "#ffeb3b" }} />
                  <Typography variant="body2">
                    {(movie.vote_average * 0.5).toFixed(1)}
                  </Typography>
                </Box>

                {data.genres?.map((genre) => (
                  <Typography
                    key={genre.id}
                    variant="h6"
                    style={{ marginTop: "-1px" }}
                    sx={{ color: "#9e9e9e" }}
                  >
                    {genre.name}
                  </Typography>
                ))}
              </Stack>
            </CardContent>
          </Box>
        ))}
      </Stack>
    </>
  );
};

MovieDetail.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieDetail;
