// pages/detail/[id].tsx
import { useRouter } from "next/router";
import useSWR from "swr";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Snackbar,
  SnackbarContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { Movie } from "@/models/Movie";
import { Rating, Chip } from "@mui/material";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import { format, isValid } from "date-fns";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { Styles } from "@/stylescomponents/style";
import AvatarView from "@/components/movie/AvatarView";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import StarRateIcon from "@mui/icons-material/StarRate";
import Popover from "@mui/material/Popover";
import CancelIcon from "@mui/icons-material/Cancel";
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  // Thêm các thuộc tính khác của cast nếu cần
}

const HeaderDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };

  const session_id = getCookie("session_id");
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để kiểm tra xem user đã vote cho bộ phim này chưa
        const response = await axios.get(`/movie/${id}/account_states`, {
          params: {
            session_id: session_id,
          },
        });

        const hasVoted = response.data?.rated;

        // Nếu user đã vote, lấy giá trị vote từ API
        if (hasVoted) {
          setUserRating(response.data?.rated.value / 2);
          setHasVoted(true);
        } else {
          // Nếu user chưa vote, kiểm tra xem có vote trong local storage không
          const storedUserRating = localStorage.getItem(`userRating_${id}`);
          const storedHasVoted = localStorage.getItem(`hasVoted_${id}`);

          if (storedHasVoted && storedUserRating) {
            setUserRating(parseInt(storedUserRating, 10));
            setHasVoted(true);
          }
        }
      } catch (error) {
        console.error("Error checking voting state:", error);
      }
    };

    fetchData();
  }, [session_id, id]);
  const handleThumbUp = () => {
    setIsThumbUpPressed((prev) => !prev);
  };

  const [isTurnedInPressed, setIsTurnedInPressed] = useState(
    localStorage.getItem(`watchlist${id}`) === "true"
  );
  const [isThumbUpPressed, setIsThumbUpPressed] = useState(
    localStorage.getItem(`thumbUp_${id}`) === "true"
  );
  const handleGenreClick = (genreId) => {
    router.push(`/detail/Find?genre=${genreId}`);
    setSelectedGenre(genreId);
  };
  const [selectedGenre, setSelectedGenre] = useState(null);
  const handleWatchList = async () => {
    try {
      const response = await axios.post(
        `/account/{account_id}/watchlist`,
        {
          media_type: "movie",
          media_id: id,
          watchlist: !isTurnedInPressed,
        },
        {
          params: {
            session_id: session_id,
          },
        }
      );

      console.log("Favorite request success:", response.data);
      setIsTurnedInPressed(!isTurnedInPressed);
      localStorage.setItem(`watchlist${id}`, !isTurnedInPressed);
    } catch (error) {
      console.error("Error making favorite request:", error);
    }
  };
  const handleFavorite = async () => {
    try {
      const response = await axios.post(
        `/account/{account_id}/favorite`,
        {
          media_type: "movie",
          media_id: id,
          favorite: !isThumbUpPressed,
        },
        {
          params: {
            session_id: session_id,
          },
        }
      );

      console.log("Favorite request success:", response.data);
      setIsThumbUpPressed(!isThumbUpPressed);
      localStorage.setItem(`thumbUp_${id}`, !isThumbUpPressed);
    } catch (error) {
      console.error("Error making favorite request:", error);
    }
  };
  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (remainingMinutes > 0) {
      return `${remainingMinutes}m`;
    }

    return "";
  };

  const fetcher = (url: string) =>
    axios.get(url).then((response) => response.data);
  const { data, error } = useSWR<Movie>(
    `/movie/${id}?append_to_response=credits`,
    fetcher
  );

  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };

  const handleClickOpen = () => {
    if (!session_id) {
      setSnackbarMessage("Login Required");
      setSnackbarOpen(true);
    } else {
      handleWatchList();
    }
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const [showRating, setShowRating] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleStarClick = (event) => {
    setAnchorEl(event.currentTarget);
    setShowRating(true); // Hiển thị box đánh giá
  };
  const handleClosePopover = () => {
    setAnchorEl(null);
    setShowRating(false); // Thêm dòng này để ẩn box đánh giá khi đóng Popover
  };

  const handleRatingChange = async (event, newValue) => {
    try {
      // Gọi API để gửi đánh giá
      const response = await axios.post(
        `/movie/${id}/rating`,
        {
          value: newValue * 2,
        },
        {
          params: {
            session_id: session_id,
          },
        }
      );

      console.log("Rating request success:", response.data);

      // Đóng box đánh giá và cập nhật các state cần thiết
      setShowRating(false);
      setAnchorEl(null);

      // Lưu trạng thái vote vào local storage trước khi cập nhật state
      localStorage.setItem(`userRating_${id}`, newValue);

      // Cập nhật giá trị userRating khi vote thành công
      setUserRating(newValue);
      setHasVoted(true);
    } catch (error) {
      console.error("Error making rating request:", error);
    }
  };

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
      setUserRating(0);
      localStorage.removeItem(`userRating_${movieId}`);
      // Sau khi xóa, bạn có thể làm mới danh sách votelist để cập nhật UI.
      // Chẳng hạn: mutate(`/account/{account_id}/rated/movies?session_id=${session_id}`);
    } catch (error) {
      console.error("Lỗi khi xóa đánh giá", error);
      // Xử lý lỗi nếu cần
    }
  };
  if (error) return <div>Error loading movie details</div>;
  if (!data) return <div>Loading...</div>;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <>
      <Stack
        direction="row"
        spacing={33}
        sx={{ position: "absolute", zIndex: "1", left: "20px", top: "20px" }}
        alignItems={"center"}
      >
        <ArrowBackIcon
          onClick={() => router.back()}
          sx={{ fontSize: "40px" }}
        />

        <AvatarView></AvatarView>
      </Stack>
      <Box sx={{ position: "relative" }}>
        <Box
          component="img"
          src={
            data.poster_path
              ? `https://image.tmdb.org/t/p/w400${data.poster_path}`
              : "/images/DefaultPoster.png" // Đường dẫn đến hình ảnh mặc định
          }
          alt={data.title}
          sx={{
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.3)",
            width: "380px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            zIndex: "1",
            bottom: "0px",
            right: "7px",
          }}
        >
          <Stack
            spacing={1}
            sx={{
              background: "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
              width: "345px",
              marginX: "-15px",
              zIndex: 1,
              padding: "20px",
            }}
          >
            <Typography variant="h3" sx={{}}>
              {data.title}
            </Typography>
            <Stack direction={"row"} spacing={1}>
              <Stack direction={"row"}>
                <Typography sx={{ color: "yellow", marginY: "3px" }}>
                  <StarIcon></StarIcon>
                </Typography>
                <Typography variant="h6" sx={{ color: "yellow" }}>
                  {(data.vote_average * 0.5).toFixed(1)}
                </Typography>
              </Stack>
              <Typography
                variant="h5"
                sx={{ fontStyle: "italic", textAlign: "justify" }}
              >
                {data.tagline}
              </Typography>
            </Stack>
            <Stack direction={"row"} spacing={12} width={"100%"}>
              <Stack spacing={1} alignItems={"center"} direction={"row"}>
                <CalendarMonthIcon />
                <Typography variant="h6">
                  {isValid(new Date(data.release_date))
                    ? format(new Date(data.release_date), "dd/MM/yyyy")
                    : "dd/MM/yy"}
                </Typography>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <IconButton
                  color="inherit"
                  onClick={() => {
                    if (!session_id) {
                      handleClickOpen();
                    } else {
                      handleWatchList();
                    }
                  }}
                >
                  <TurnedInIcon
                    sx={{
                      color: session_id
                        ? isTurnedInPressed
                          ? "yellow"
                          : "inherit"
                        : "inherit",
                    }}
                  />
                </IconButton>
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={1500}
                  onClose={handleSnackbarClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }} // Đặt vị trí ở Top-Center
                  style={{ background: "yellow" }}
                >
                  <SnackbarContent
                    message={
                      <Stack direction="row" alignItems="center">
                        {/* Add the icon here */}
                        <WarningAmberIcon sx={{ marginRight: 1 }} />
                        Login to add this movie to your list
                      </Stack>
                    }
                    sx={{
                      backgroundColor: "yellow",
                      color: "black",
                    }}
                  />
                </Snackbar>

                <IconButton
                  color="inherit"
                  onClick={() => {
                    if (!session_id) {
                      handleClickOpen();
                    } else {
                      handleFavorite();
                    }
                  }}
                >
                  <FavoriteIcon
                    sx={{
                      color: session_id
                        ? isThumbUpPressed
                          ? "red"
                          : "inherit"
                        : "inherit",
                    }}
                  />
                </IconButton>
                <Tooltip
                  title={
                    session_id ? "" : "Login to add this movie to your list"
                  }
                  arrow
                  placement="top"
                  enterTouchDelay={0}
                  style={{ fontSize: "14px", maxWidth: "200px" }}
                >
                  <Box>
                    <IconButton color="inherit" onClick={handleStarClick}>
                      <StarRateIcon
                        sx={{ color: hasVoted ? "yellow" : "inherit" }}
                      />
                    </IconButton>
                    <Popover
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      onClose={handleClosePopover}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                    >
                      {/* Hiển thị rating và cho phép đánh giá */}
                      {showRating && (
                        <Box
                          sx={{
                            backgroundColor: "white",
                            padding: "16px",
                            borderRadius: "8px",
                            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Rating
                            value={userRating}
                            onChange={
                              session_id ? handleRatingChange : undefined
                            }
                            sx={{ color: hasVoted ? "yellow" : "yellow" }}
                          />
                          <CancelIcon
                            onClick={() => handleDeleteRating(id)}
                          ></CancelIcon>
                        </Box>
                      )}
                    </Popover>
                  </Box>
                </Tooltip>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
      <Stack spacing={1} sx={{ marginX: "15px" }}>
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <AccessTimeIcon />
          <Typography variant="h6">
            {data.runtime ? formatRuntime(data.runtime) : "Don't know"}
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={2}>
          {data.genres?.slice(0, 4).map((genre) => (
            <Chip
              key={genre.id}
              label={genre.name}
              variant="outlined"
              sx={{
                color: "white",
              }}
              onClick={() => handleGenreClick(genre.id)}
            />
          ))}
        </Stack>
      </Stack>
      <Stack>
        <Box padding={"20px"}>
          <Stack>
            <Typography variant="h4" sx={{ ..._letterStyles }}>
              Story Line
            </Typography>
            <Typography
              sx={{
                marginTop: "6px",
                fontSize: "18px",
                color: "white",
                textAlign: "justify",
              }}
            >
              {expandedOverview === data.overview
                ? data.overview
                : data.overview.length > 90
                ? `${data.overview.slice(0, 90)}...`
                : data.overview}
              {data.overview.length > 90 && (
                <Button
                  sx={{ fontSize: "12px", color: "lightgreen" }}
                  onClick={() => toggleText(data.overview)}
                >
                  {expandedOverview === data.overview ? "Less" : "More"}
                </Button>
              )}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </>
  );
};

HeaderDetail.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default HeaderDetail;
