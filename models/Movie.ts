import { CreditSection } from "./Credit";
import { VideoList } from "./Video";

export interface MovieList {
  results: Movie[];
}
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface Movie {
  id: string;
  title: string;
  Genne: string[];
  poster_path: string;
  backdrop_path: string;
  budget: string;
  overview: string;
  popularity: number;
  release_date: string;
  runtime: number;
  video: boolean;
  production_countries: ProductionCountry[];
  videos: VideoList;
  credits: CreditSection;
  vote_average: string;
}
