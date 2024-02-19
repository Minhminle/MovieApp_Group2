import { CreditSection } from "./Credit";
import { Genres } from "./Genres";
import { Images } from "./Images";
import { PersonSection } from "./Person";
import { VideoList } from "./Video";

export interface MovieList {
  results: Movie[];
}
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
  id: number;
  logo_path: string;
  origin_country: string;
}

export interface Movie {
  id: string;
  title: string;
  Genne: string[];
  poster_path: string;
  backdrop_path: string;
  budget: string;
  overview: string;
  vote_count: number;
  vote_average: number;
  popularity: number;
  release_date: string;
  runtime: number;
  video: boolean;
  release_dat: string;
  production_countries: ProductionCountry[];
  videos: VideoList;
  credits: CreditSection;
  images: Images;
  person: PersonSection;
  tagline: string;
  rating: number;
  genres: Genres[];
}
