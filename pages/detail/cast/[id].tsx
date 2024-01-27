import { Movie } from "@/models/Movie";
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import router, { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import useSWR from "swr";
import { Person, PersonSection } from "@/models/Person";
import { CreditSection } from "@/models/Credit";
import { color } from "@mui/system";
import { format, compareDesc } from "date-fns";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
const DetailCast = () => {
  const getGenderLabel = (gender) => {
    return gender === 2 ? "Male" : gender === 1 ? "Female" : "Unknown";
  };

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);

  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR<Person>(
    `/person/${id}?append_to_response=movie_credits`
  );
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };
  const [visibleItems, setVisibleItems] = useState(5); // Số lượng mục hiển thị ban đầu

  const handleLoadMore = () => {
    // Tăng số lượng items đã hiển thị thêm 5
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 5);
  };
  return (
    <>
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <ArrowBackIcon
          onClick={() => router.back()}
          sx={{ fontSize: "40px" }}
        />
        <Typography sx={{ fontSize: "30px", fontWeight: "bolder" }}>
          Actor profile
        </Typography>
      </Stack>
      {data && (
        <Stack spacing={2} padding={"10px"}>
          <Stack direction={"row"} spacing={2} alignItems="center">
            <Box
              component="img"
              src={
                data.profile_path
                  ? `https://image.tmdb.org/t/p/w500${data.profile_path}`
                  : "/images/DefaultAvatar.jpg" // Đường dẫn đến hình ảnh mặc định
              }
              alt={data.name}
              sx={{ width: "50%", borderRadius: "18px" }}
            />
            <Stack sx={{ ..._letterStyles, padding: "10px" }}>
              <Typography sx={{ color: "#80deea", fontWeight: "bolder" }}>
                Name:
              </Typography>
              <Typography>{data.name}</Typography>
              <Typography sx={{ color: "#80deea", fontWeight: "bolder" }}>
                Known For:
              </Typography>
              <Typography>{data.known_for_department}</Typography>
              <Typography sx={{ color: "#80deea", fontWeight: "bolder" }}>
                Place of Birth:
              </Typography>
              <Typography>
                {expandedOverview === data.place_of_birth
                  ? data.place_of_birth
                  : data.place_of_birth.length > 30
                  ? `${data.place_of_birth.slice(0, 30)}...`
                  : data.place_of_birth}
              </Typography>
              <Typography sx={{ color: "#80deea", fontWeight: "bolder" }}>
                Gender:
              </Typography>
              <Typography>{getGenderLabel(data.gender)}</Typography>
              <Typography sx={{ color: "#80deea", fontWeight: "bolder" }}>
                Birthday:
              </Typography>
              <Typography>
                {format(new Date(data.birthday), "dd/MM/yyyy")}
              </Typography>
            </Stack>
          </Stack>
          <Box>
            <Typography variant="h4" sx={{ ..._letterStyles }}>
              Biography
            </Typography>
            <Typography>
              {expandedOverview === data.biography
                ? data.biography
                : data.biography.length > 150
                ? `${data.biography.slice(0, 150)}...`
                : data.biography}
              {data.biography.length > 150 && (
                <Button
                  sx={{ fontSize: "12px", color: "green" }}
                  onClick={() => toggleText(data.biography)}
                >
                  {expandedOverview === data.biography ? "Less" : "More"}
                </Button>
              )}
            </Typography>
          </Box>
        </Stack>
      )}
      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Know For:
      </Typography>
      <Stack
        direction="row"
        sx={{ overflowX: "auto" }} // Thêm kiểm soát tràn ngang
      >
        {data?.movie_credits.cast.map((movie: Movie) => (
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
      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Acting:
      </Typography>
      <Stack>
        {data?.movie_credits.cast
          .sort((a: Movie, b: Movie) =>
            compareDesc(new Date(a.release_date), new Date(b.release_date))
          )
          .slice(0, visibleItems) // Chỉ hiển thị số lượng đã được xác định
          .map((movie: Movie) => (
            <Box
              key={movie.id}
              sx={{
                margin: "10px",
                backgroundColor: "black",
                color: "white",
              }}
            >
              <Stack
                direction={"row"}
                padding={"20px"}
                spacing={3}
                borderBottom={"ridge"}
                alignItems={"center"}
              >
                <Typography>
                  {movie.release_date &&
                    format(new Date(movie.release_date), "yyyy")}
                </Typography>
                <Stack>
                  <Typography
                    variant="h5"
                    onClick={() => handleDetailClick(movie.id)}
                  >
                    {expandedOverview === movie.title
                      ? movie.title
                      : movie.title.length > 20
                      ? `${movie.title.slice(0, 20)}...`
                      : movie.title}
                  </Typography>
                  <Stack direction={"row"} spacing={2}>
                    <Typography color={"gray"}>as</Typography>
                    <Typography>{movie.character}</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          ))}
        {visibleItems < data?.movie_credits.cast.length && (
          <Button onClick={handleLoadMore}>Load More</Button>
        )}
      </Stack>
    </>
  );
};

DetailCast.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default DetailCast;
