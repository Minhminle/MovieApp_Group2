import { CreditSection } from "./Credit";
import { Images } from "./Images";
<<<<<<< HEAD
import { ListReview } from "./Reviews";
=======
import { PersonSection } from "./Person";
>>>>>>> develop
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

export interface Genres {
  id: string;
  name: string;
}

export interface GenreList {
  genres: Genres[];
}
export interface Movie {
  id: string;
  title: string;
  Genne: string[];
  genre_ids: number[];
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
<<<<<<< HEAD
  reviews:ListReview;
=======
  person: PersonSection;
>>>>>>> develop
}
