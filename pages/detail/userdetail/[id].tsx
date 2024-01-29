6489571;
import React, { useState } from "react";
import useSWR from "swr";
import { User } from "@/models/Auth";
import { useRouter } from "next/router";
import { Avatar, Box, Stack, Typography, Tab, Button } from "@mui/material";
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { Movie } from "@/models/Movie";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ST } from "next/dist/shared/lib/utils";
import StarRateIcon from "@mui/icons-material/StarRate";
const UserDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [value, setValue] = React.useState("1");
  const session_id = getCookie("session_id");
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { data: userDetails } = useSWR<User>(
    `/account?session_id=${session_id}`,
    fetcher
  );
  const { data: watchList } = useSWR<Movie>(
    id ? `/account/${id}/watchlist/movies?session_id=${session_id}` : null,
    fetcher
  );
  const { data: faVourite } = useSWR<Movie>(
    id
      ? `/account/{account_id}/favorite/movies?session_id=${session_id}`
      : null,
    fetcher
  );

  const { data: dataGenre } = useSWR("/genre/movie/list");
  const genres = dataGenre?.genres || [];
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const [visibleItems, setVisibleItems] = useState(10);
  const handleLoadMore = () => {
    // Tăng số lượng phim hiển thị, có thể điều chỉnh theo ý muốn
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 10);
  };
  return (
    <>
      <Stack direction="row" alignItems="center">
        <ArrowBackIcon
          onClick={() => router.back()}
          sx={{ fontSize: "40px" }}
        />
        <Stack fontSize="30px" fontWeight="bolder">
          View Profile
        </Stack>
      </Stack>
      <Stack>
        {userDetails && (
          <Stack>
            <Stack>
              <Avatar
                src={`https://image.tmdb.org/t/p/w500${userDetails.avatar.tmdb.avatar_path}`}
                sx={{
                  marginRight: "10px",
                  width: "150px",
                  height: "150px",
                  marginLeft: "130px",
                }}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
      <Stack fontSize="40px" textAlign="center">
        {userDetails?.username}
      </Stack>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  sx={{
                    "& .MuiTab-root": {
                      color: "#9e9e9e",
                    },
                    "& .Mui-selected": {
                      color: "white",
                    },
                  }}
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label={`Watch List (${watchList?.results.length})`}
                    value="1"
                  />
                  <Tab
                    label={`Favourite (${faVourite?.results.length}) `}
                    value="2"
                  />
                </TabList>
              </Box>
            </TabContext>
          </Box>
          <TabPanel value="1">
            <Stack alignContent="center" spacing={2}>
              {watchList?.results.slice(0, visibleItems).map((movie) => (
                <Stack key={movie.id}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
                      }
                      width={80}
                      height={120}
                      sx={{ borderRadius: "16px" }}
                      onClick={() => handleDetailClick(movie.id)}
                    />
                    <Stack direction="column">
                      <Stack>{movie.title}</Stack>
                      <Stack>
                        <Stack direction="row">
                          <StarRateIcon sx={{ color: "yellow" }}></StarRateIcon>
                          <Box sx={{ color: "white" }}>
                            {(movie.vote_average * 0.5).toFixed(1)}/5
                          </Box>
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
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
            {visibleItems < watchList?.results.length && (
              <Button onClick={handleLoadMore}>Load More</Button>
            )}
          </TabPanel>
          <TabPanel value="2">
            <Stack alignContent="center" spacing={2} direction="column-reverse">
              {faVourite?.results.slice(0, visibleItems).map((movie) => (
                <Stack key={movie.id}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      component="img"
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
                      }
                      width={80}
                      height={120}
                      sx={{ borderRadius: "16px" }}
                      onClick={() => handleDetailClick(movie.id)}
                    />
                    <Stack direction="column">
                      <Stack>{movie.title}</Stack>
                      <Stack>
                        <Stack direction="row">
                          <StarRateIcon sx={{ color: "yellow" }}></StarRateIcon>
                          <Box sx={{ color: "white" }}>
                            {(movie.vote_average * 0.5).toFixed(1)}/5
                          </Box>
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
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </Stack>
            {visibleItems < faVourite?.results.length && (
              <Button onClick={handleLoadMore}>Load More</Button>
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default UserDetail;
