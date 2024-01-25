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
import router, { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import useSWR from "swr";
import { Person, PersonSection } from "@/models/Person";
import { Movie } from "@/models/Movie";
import StarIcon from "@mui/icons-material/Star";

const DetailCast = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR<Person>(
    `/person/${id}?append_to_response=images,external_ids,movie_credits`
  );
  const getGenderLabel = (gender) => {
    return gender === 2 ? "Male" : gender === 1 ? "Female" : "Unknown";
  };
  const _letterStyles = {
    color: "white",
    fontWeight: "700",
  };

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);
  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };
  const handleDetailClick = (movieId: string) => {
    router.push(`/detail/movie/${movieId}`);
  };

  return (
    <>
      {data && (
        <Stack spacing={2}>
          <Stack direction={"row"} spacing={2}>
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/w500${data.profile_path}`}
              alt={data.name}
              sx={{ width: "40%", borderRadius: "18px" }}
            />
            <Stack sx={{ color: "white" }}>
              <Typography>Name: {data.name}</Typography>
              <Typography>Place of Birth: {data.place_of_birth}</Typography>
              <Typography>Gender: {getGenderLabel(data.gender)}</Typography>
              <Typography>Birthday: {data.birthday}</Typography>
            </Stack>
          </Stack>
          <Box>
            <Typography sx={{ fontSize: "30px", fontWeight: "20px" }}>
              Biography
            </Typography>
            <Typography>{data.biography}</Typography>
          </Box>
        </Stack>
      )}
      <Typography variant="h4" sx={{ ..._letterStyles, padding: "10px" }}>
        Similar Movies:
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
    </>
  );
};

DetailCast.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default DetailCast;
