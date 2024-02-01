6489571;
import React, { useState } from "react";
import useSWR from "swr";
import { User } from "@/models/Auth";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  Tab,
  Button,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { Movie } from "@/models/Movie";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ST } from "next/dist/shared/lib/utils";
import StarRateIcon from "@mui/icons-material/StarRate";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CancelIcon from "@mui/icons-material/Cancel";
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
    `/account?session_id=${session_id}`
  );
  const { data: watchList } = useSWR<Movie>(
    id
      ? `/account/{account_id}/watchlist/movies?session_id=${session_id}`
      : null
  );
  const { data: faVourite } = useSWR<Movie>(
    id ? `/account/{account_id}/favorite/movies?session_id=${session_id}` : null
  );
  const { data: votelist } = useSWR<Movie>(
    `/account/{account_id}/rated/movies?session_id=${session_id}`
  );
  // const { data: votelist } = useSWR<Movie>(
  //   `/account/${session_id}/rated/movies`
  // );

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
  const [hasVoted, setHasVoted] = useState(false);
  const handleDeleteRating = async (movieId) => {
    try {
      const response = await axios.delete(`/movie/${movieId}/rating`, {
        params: {
          session_id: session_id,
        },
      });

      // Xử lý sau khi xóa thành công, có thể làm mới danh sách hoặc hiển thị thông báo thành công.
      console.log("Xóa đánh giá thành công", response);
      setHasVoted(false);
      localStorage.removeItem(`userRating_${id}`);
      // Sau khi xóa, bạn có thể làm mới danh sách votelist để cập nhật UI.
      // Chẳng hạn: mutate(`/account/{account_id}/rated/movies?session_id=${session_id}`);
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá", error);
      // Xử lý lỗi nếu cần
    }
  };
  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center">
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
                  marginLeft: "115px",
                  marginTop: "10px",
                }}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
      <Typography variant="h4" textAlign={"center"} marginTop={"10px"}>
        {userDetails?.username}
      </Typography>
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
                  <Tab
                    label={`Watch List (${watchList?.results.length})`}
                    value="1"
                  />
                  <Tab
                    label={`Favourite (${faVourite?.results.length}) `}
                    value="2"
                  />
                  <Tab
                    label={`Vote List (${votelist?.results.length}) `}
                    value="3"
                  />
                </TabList>
              </Box>
            </TabContext>
          </Box>
          <TabPanel value="1">
            <Stack alignContent="center" spacing={2} direction="column-reverse">
              {watchList?.results.map((movie) => (
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
                      <Stack direction={"row"} alignItems={"center"}>
                        {movie.title}{" "}
                        <IconButton color="inherit">
                          <TurnedInIcon
                            sx={{
                              color: "yellow",
                            }}
                          />
                        </IconButton>
                      </Stack>
                      <Stack>
                        <Stack direction="row" textAlign={"center"}>
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
          </TabPanel>
          <TabPanel value="2">
            <Stack alignContent="center" spacing={2} direction="column-reverse">
              {faVourite?.results.map((movie) => (
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
                      <Stack direction={"row"} alignItems={"center"}>
                        {movie.title}
                        <IconButton>
                          <FavoriteIcon sx={{ color: "red" }} />
                        </IconButton>
                      </Stack>
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
          </TabPanel>
          <TabPanel value="3">
            <Stack alignContent="center" spacing={2} direction="column-reverse">
              {votelist?.results.map((movie) => (
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

                    <Stack>
                      {movie.title}
                      <Stack direction={"row"} alignItems={"center"}>
                        <StarRateIcon sx={{ color: "yellow" }}></StarRateIcon>
                        <Stack direction="row">
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
          </TabPanel>
        </TabContext>
      </Box>
    </>
  );
};

export default UserDetail;
