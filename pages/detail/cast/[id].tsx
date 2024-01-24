
import { Movie } from "@/models/Movie";
import { Box, Stack } from "@mui/material";
import router, { useRouter } from "next/router";
import React, { ReactElement, useState } from 'react'
import useSWR from "swr";
import { Person, PersonSection } from "@/models/Person";


const DetailCast = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data } = useSWR<Person>(
        `/person/${id}`
    );
    return (
        <>
            <Stack sx={{ color: "white" }}>
                {data?.name}
            </Stack>

        </>
    )
}

DetailCast.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
};

export default DetailCast;






