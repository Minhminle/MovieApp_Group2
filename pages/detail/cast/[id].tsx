
import { Movie } from "@/models/Movie";
import { Box, Button, CardContent, CardMedia, Stack, Typography } from "@mui/material";
import router, { useRouter } from "next/router";
import React, { ReactElement, useState } from 'react'
import useSWR from "swr";
import { Person, PersonSection } from "@/models/Person";
import { CreditSection } from "@/models/Credit";
import { color } from "@mui/system";
import { format } from "date-fns";
import StarIcon from "@mui/icons-material/Star";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
    return (
        <>
            <ArrowBackIcon
                onClick={() => router.back()}
                sx={{ fontSize: "40px" }}
            />
            {data && (
                <Stack spacing={2} padding={"10px"}>
                    <Stack direction={"row"} spacing={2} alignItems="center">
                        <Box
                            component="img"
                            src={`https://image.tmdb.org/t/p/w500${data.profile_path}`}
                            alt={data.name}
                            sx={{ width: "40%", borderRadius: "18px" }}
                        />
                        <Stack sx={{ color: "white", padding: "10px" }}>
                            <Typography>Name: {data.name}</Typography>
                            <Typography>Known For: {data.known_for_department}</Typography>
                            <Typography>Place of Birth: {data.place_of_birth}</Typography>
                            <Typography>Gender: {getGenderLabel(data.gender)}</Typography>
                            <Typography>
                                Birthday: {format(new Date(data.birthday), "dd/MM/yyyy")}
                            </Typography>
                        </Stack>
                    </Stack>
                    <Box>
                        <Typography sx={{ fontSize: "30px", fontWeight: "20px" }}>
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



        </>
    )
}

DetailCast.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
};

export default DetailCast;





