import { CreditSection } from "./Credit";
import { VideoList } from "./Video";

export interface MovieList {
  results: Movie[];
}

export interface Genre {
  id: string;
  name: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  poster_path: string;
  backdrop_path: string;
  budget: string;
  genres: Genre[];
  overview: string;
  popularity: number;
  release_date: string;
  runtime: number;
  video: boolean;
  vote_average: number;
  release_dat: string;
  production_countries: ProductionCountry[];
  videos: VideoList;
  credits: CreditSection;
}
