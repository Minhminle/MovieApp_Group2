import { Movie } from "./Movie";

export interface WatchList {
  total_results: number;
}
export interface Favorite {
  total_results: number;
  results: Movie[];
}
export interface Rate {
  total_results: number;
  results: Movie[];
}
