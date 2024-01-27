import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";
import ReactPlayer from "react-player";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import { ReactElement } from "react";
import { Movie } from "@/models/Movie";
import Footter from "@/components/movie/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StarIcon from "@mui/icons-material/Star";
import { format } from "date-fns";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import DetailHeader from "@/components/movie/DetailHeader";
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
    `/movie/${id}?append_to_response=credits`
  );
  const { data: similarMoviesData, error: similarMoviesError } = useSWR(
    `/movie/${id}/similar`
  );
  const { data: MoviesLists, error: listsMoviesError } = useSWR(
    `/movie/${id}/lists`
  );
  const { data: dataVideo } = useSWR(`/movie/${id}/videos`);
  const { data: datareview } = useSWR(`/movie/${id}/reviews`);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const handleNextVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === dataVideo?.results.length - 1 ? 0 : prevIndex + 1
    );
  };

  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h${remainingMinutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (remainingMinutes > 0) {
      return `${remainingMinutes}m`;
    }

    return "";
  };
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const [isThumbUpPressed, setIsThumbUpPressed] = useState(false);
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleThumbUp = () => {
    setIsThumbUpPressed((prev) => !prev);
  };
  const [isTurnedInPressed, setIsTurnedInPressed] = useState(false);

  const handleTurnedIn = () => {
    setIsTurnedInPressed((prev) => !prev);
  };
  const handlePrevVideo = () => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? dataVideo?.results.length - 1 : prevIndex - 1
    );
  };
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };
  const { data: movieBackdropData, error: movieBackdropError } = useSWR<{
    backdrops: { file_path: string }[];
  }>(`/movie/${id}/images`);

  const [visibleReviews, setVisibleReviews] = useState(2); // Số lượng đánh giá hiển thị ban đầu

  const loadMoreReviews = () => {
    setVisibleReviews((prevVisibleReviews) => prevVisibleReviews + 2); // Tăng số lượng đánh giá hiển thị thêm 5
  };
  const handleDetailCastClick = (actorid: number) => {
    router.push(`/detail/cast/${actorid}`);
  };

  if (error) return <div>Error loading movie details</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <DetailHeader></DetailHeader>
      <Typography variant="h5" sx={{ color: "#1de9b6", marginTop: "10px" }}>
        <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
          Top Cast
        </Typography>
        <Stack
          gap={2}
          direction="row"
          alignItems="center"
          sx={{ overflowX: "auto" }}
        >
          {data.credits?.cast?.map((actor) => (
            <Stack key={actor.id}>
              <Box
                sx={{
                  color: "white",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              >
                <Stack direction="row" alignItems="center">
                  <Avatar
                    src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    alt={actor.name}
                    sx={{
                      marginRight: "10px",
                      width: "80px",
                      height: "80px",
                    }}
                    onClick={() => handleDetailCastClick(actor.id)}
                  />
                  <Box width="100px">
                    <Typography sx={{ fontWeight: "bold" }}>
                      {expandedOverview === actor.name
                        ? actor.name
                        : actor.name.length > 15
                        ? `${actor.name.slice(0, 15)}...`
                        : actor.name}
                    </Typography>
                    <Typography
                      color="gray"
                      variant="body2"
                      sx={{ fontWeight: "bold" }}
                    >
                      {expandedOverview === actor.character
                        ? actor.character
                        : actor.character.length > 15
                        ? `${actor.character.slice(0, 15)}...`
                        : actor.character}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          ))}
        </Stack>
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
                    label={`Trailers (${dataVideo?.results.length})`}
                    value="1"
                  />
                  <Tab
                    label={`Reviews (${datareview?.results.length})`}
                    value="2"
                  />
                  <Tab
                    label={`Poster (${movieBackdropData?.backdrops.length})`}
                    value="3"
                  />
                </TabList>
              </Box>
            </TabContext>
          </Box>
          <TabPanel value="1">
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
              sx={{ overflowX: "auto" }}
            >
              {dataVideo?.results.map((video) => (
                <Stack key={video.id}>
                  <ReactPlayer
                    key={video.id}
                    url={`https://www.youtube.com/watch?v=${video.key}`}
                    width="320px"
                    height="100%"
                    controls={true}
                  />
                </Stack>
              ))}
            </Stack>
          </TabPanel>
          <TabPanel value="2">
            {" "}
            <Stack gap={4} direction="column">
              {datareview?.results.slice(0, visibleReviews).map((review) => (
                <Stack key={review.id}>
                  <Stack direction="row">
                    <Box>
                      <Avatar
                        src={`https://image.tmdb.org/t/p/w500${review.author_details.avatar_path}`}
                        sx={{
                          marginRight: "10px",
                          width: "80px",
                          height: "80px",
                        }}
                      />
                    </Box>
                    <Stack direction="column" sx={{ marginTop: "15px" }}>
                      <Box color="white"> {review.author}</Box>
                      <Box color="gray">
                        {format(
                          new Date(review.updated_at),
                          "dd/MM/yyyy HH:mm:ss"
                        )}
                      </Box>
                    </Stack>
                  </Stack>
                  <Typography sx={{ fontSize: "18px", color: "white" }}>
                    {expandedOverview === review.content
                      ? review.content
                      : review.content.length > 90
                      ? `${review.content.slice(0, 90)}...`
                      : review.content}
                    {review.content.length > 90 && (
                      <Button
                        sx={{ fontSize: "12px", color: "blue" }}
                        onClick={() => toggleText(review.content)}
                      >
                        {expandedOverview === review.content ? "Less" : "More"}
                      </Button>
                    )}
                  </Typography>
                </Stack>
              ))}
              {datareview?.results.length > visibleReviews && (
                <Box textAlign="center" mt={2}>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "black", // Đặt màu nền là đen
                      color: "white", // Đặt màu chữ là trắng
                      border: "1px solid white", // Đặt viền là trắng
                      borderRadius: "8px", // Điều chỉnh góc bo
                      padding: "12px 24px", // Điều chỉnh khoảng cách nút
                      fontSize: "16px", // Điều chỉnh kích thước chữ
                      textTransform: "none", // Ngăn chữ in hoa
                    }}
                    onClick={loadMoreReviews}
                  >
                    Load More
                  </Button>
                </Box>
              )}
            </Stack>
          </TabPanel>
          <TabPanel value="3">
            <Stack direction={"row"} spacing={2} sx={{ overflowX: "auto" }}>
              {movieBackdropData?.backdrops.map((backdrop) => (
                <Box
                  key={backdrop.file_path}
                  component="img"
                  src={`https://image.tmdb.org/t/p/w500${backdrop.file_path}`}
                  alt={`${data.title} backdrop`}
                  sx={{ width: "400px" }}
                />
              ))}
            </Stack>
          </TabPanel>
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
              image={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
              }
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

                {data.genres?.slice(0, 2).map((genre) => (
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
      <Footter />
    </>
  );
};

MovieDetail.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default MovieDetail;
