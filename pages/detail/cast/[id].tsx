import { Box, Button, Stack, Typography } from "@mui/material";
import router, { useRouter } from "next/router";
import React, { ReactElement, useState } from "react";
import useSWR from "swr";
import { Person, PersonSection } from "@/models/Person";
import { format } from "date-fns";

const DetailCast = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useSWR<Person>(
    `/person/${id}?append_to_response=images,external_ids,movie_credits`
  );
  const getGenderLabel = (gender) => {
    return gender === 2 ? "Male" : gender === 1 ? "Female" : "Unknown";
  };

  const [expandedOverview, setExpandedOverview] = useState<string | null>(null);

  const toggleText = (overview: string) => {
    setExpandedOverview((prev) => (prev === overview ? null : overview));
  };

  return (
    <>
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
    </>
  );
};

DetailCast.getLayout = function getLayout(page: ReactElement) {
  return <>{page}</>;
};

export default DetailCast;
