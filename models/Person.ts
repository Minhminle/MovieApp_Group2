import { Movie } from "./Movie";
export interface PersonSection {
    listPerson: Person[];
}

export interface Person {
    id: number;
    name: string;
    profile_path: string;
    place_of_birth: string;
    gender: number;
    birthday: string;
    biography: string;
    external_ids: ExternalIds;
    movie_credits: MovieCredits;
    known_for_department: string;
}
export interface MovieCredits {
    cast: Movie[];
}
export interface ExternalIds {
    facebook_id: string;
    instagram_id: string;
    twitter_id: string;
    tiktok_id: string;
    youtube_id: string;
}