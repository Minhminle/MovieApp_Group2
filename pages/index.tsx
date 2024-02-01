import React from "react";
import { LinearProgress } from "@mui/material";

import HomePage from "@/components/HomePage";
import useSWR from "swr";
import { MovieList } from "@/models/Movie";

const Home: React.FC = () => {
  const { data, isLoading, error } = useSWR<MovieList>("/movie/popular");

  if (isLoading) {
    return (
      <div>
        <LinearProgress color="inherit" />
      </div>
    );
  }

  return (
    <>
      <HomePage />
    </>
  );
};

export default Home;
